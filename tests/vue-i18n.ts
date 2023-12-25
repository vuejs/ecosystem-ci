import { runInRepo } from '../utils'
import { RunOptions } from '../types'
import path from 'node:path'
import fs from 'node:fs'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'intlify/vue-i18n-next',
		branch: 'master',
		build: 'build --all -t',
		beforeTest: [
			'pnpm playwright install chromium',
			async () => {
				const dir = path.resolve(options.workspace, 'vue-i18n')
				const filePath = path.resolve(
					dir,
					'test-dts/vue-i18n/components.test-d.tsx',
				)
				const file = fs.readFileSync(filePath, 'utf-8')
				fs.writeFileSync(filePath, `import 'vue/jsx'\n` + file)
			},
		],
		test: ['test:cover', 'test:type', 'test:e2e'],
	})
}
