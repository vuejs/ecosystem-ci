import fs from 'node:fs'
import path from 'node:path'
import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

const vitestContextDependencies = [
	'@vitest/coverage-istanbul',
	'vite',
	'vitest',
] as const

export async function test(options: RunOptions) {
	const dir = path.resolve(options.workspace, 'radix-vue')

	await runInRepo({
		...options,
		repo: 'radix-vue/radix-vue',
		branch: 'v2',
		dir,
		patchFiles: {
			'package.json': (content) => {
				const pkg = JSON.parse(content)
				const corePkg = JSON.parse(
					fs.readFileSync(
						path.join(dir, 'packages/core/package.json'),
						'utf-8',
					),
				)
				pkg.devDependencies ||= {}
				// Root tooling resolves Vitest too. Mirror the context-defining test
				// dependencies so pnpm links the same instance as packages/core.
				for (const name of vitestContextDependencies) {
					const version = corePkg.devDependencies?.[name]
					if (typeof version === 'string') {
						pkg.devDependencies[name] = version
					}
				}
				return `${JSON.stringify(pkg, null, 2)}\n`
			},
		},
		test: 'test',
	})
}
