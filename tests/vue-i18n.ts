import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'intlify/vue-i18n',
		branch: 'master',
		build: {
			script: 'build',
			args: ['--all', '-t'],
		},
		beforeTest: 'pnpm playwright install chromium',
		test: [
			'test:cover',
			'test:type',
			{
				script: 'test:e2e',
				args: ['--exclude', 'e2e/bridge/**'],
			},
		],
	})
}
