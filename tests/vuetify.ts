import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vuetifyjs/vuetify',
		branch: 'master',
		build: 'yarn workspace vuetify run build',
		// there's also an e2e test script in vuetify,
		// but it seems flaky, so I skipped it for now
		test: ['yarn lerna run test:coverage -- -- -i'],
		patchFiles: {
			'packages/vuetify/src/globals.d.ts': (content) => {
				if (!content.includes('vue/jsx')) {
					return `import 'vue/jsx'\n${content}`
				} else {
					return content
				}
			},
		},
	})
}
