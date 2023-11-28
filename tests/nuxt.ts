import { runInRepo } from '../utils'
import { RunOptions } from '../types'
import path from 'node:path'
import fs from 'node:fs'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nuxt/nuxt',
		build: 'build',
		beforeTest: [
			'pnpm playwright-core install chromium',
			async () => {
				const dir = path.resolve(options.workspace, 'nuxt')
				const filePath = path.resolve(
					dir,
					'packages/nuxt/test/auto-import.test.ts',
				)
				const file = fs.readFileSync(filePath, 'utf-8')
				fs.writeFileSync(
					filePath,
					file.replace("'compile'", "'compile', 'ErrorTypeStrings'"),
				)
			},
		],
		test: ['test:fixtures', 'test:types', 'test:unit'],
	})
}
