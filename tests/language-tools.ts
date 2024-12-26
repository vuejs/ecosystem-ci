import path from 'node:path'
import fs from 'node:fs'
import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'
import { REGISTRY_ADDRESS } from '../registry.ts'
import YAML from 'yaml'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vuejs/language-tools',
		branch: 'master',
		beforeBuild: `pnpm dedupe --registry=${REGISTRY_ADDRESS}`,
		build: 'build',
		test: 'test',
		overrideVueVersion: '@^3.5.2',
		patchFiles: {
			'package.json': (content) => {
				const pkg = JSON.parse(content)
				const versions = resolveTypeScriptVersion(options)
				if (versions.typescript)
					pkg.devDependencies.typescript = versions.typescript
				return JSON.stringify(pkg, null, 2)
			},
			'test-workspace/package.json': (content) => {
				const pkg = JSON.parse(content)
				const versions = resolveTypeScriptVersion(options, 'test-workspace', [
					'typescript-stable',
					'typescript-next',
				])
				if (versions['typescript-stable'])
					pkg.devDependencies['typescript-stable'] =
						versions['typescript-stable']
				if (versions['typescript-next'])
					pkg.devDependencies['typescript-next'] = versions['typescript-next']
				return JSON.stringify(pkg, null, 2)
			},
		},
	})
}

function resolveTypeScriptVersion(
	options: RunOptions,
	importer = '.',
	pkgNames = ['typescript'],
): Record<string, string> {
	const data = resolveLockFile(options)
	if (!data) return {}

	return pkgNames.reduce(
		(acc, pkgName) => {
			const version =
				data.importers[importer]?.devDependencies?.[pkgName]?.version
			if (version) {
				acc[pkgName] = `npm:typescript@${version.split('@').pop()}`
			}
			return acc
		},
		{} as Record<string, string>,
	)
}

let lockFileCache: any
function resolveLockFile(options: RunOptions, dirName = 'language-tools'): any {
	if (lockFileCache) return lockFileCache

	const filePath = path.resolve(options.workspace, dirName, 'pnpm-lock.yaml')
	try {
		const content = fs.readFileSync(filePath, 'utf-8')
		return (lockFileCache = YAML.parse(content))
	} catch (error) {
		console.error('Error reading lockfile:', error)
		return null
	}
}
