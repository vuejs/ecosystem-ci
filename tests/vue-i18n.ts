import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'intlify/vue-i18n-next',
		branch: 'master',
		build: 'build --all -t',
		beforeTest: ['pnpm playwright install chromium'],
		test: ['test:cover', 'test:type', 'test:e2e'],
	})
}
