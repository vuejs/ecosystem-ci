import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'intlify/vue-i18n-next',
		branch: 'master',
		build: 'build --all -t',
		beforeTest: 'pnpm playwright install chromium',

		// 'test:e2e' is left out because it requires the browser build of Vue,
		// which is very time consuming because of terser.
		// We'll add it back later when we can do this perfomantly.
		test: ['test:cover', 'test:type'],
	})
}
