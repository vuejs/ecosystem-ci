import { runInRepo } from '../utils'
import { RunOptions } from '../types'
import path from 'node:path'
import fs from 'node:fs'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vuetifyjs/vuetify',
		branch: 'master',
		beforeBuild: async () => {
			const dir = path.resolve(options.workspace, 'vuetify')
			const filePath = path.resolve(dir, 'packages/vuetify/src/globals.d.ts')
			const file = fs.readFileSync(filePath, 'utf-8')
			fs.writeFileSync(filePath, `import 'vue/jsx'\n` + file)
		},
		build: 'yarn workspace vuetify run build',
		// there's also an e2e test script in vuetify,
		// but it seems flaky, so I skipped it for now
		test: ['yarn lerna run test:coverage -- -- -i'],
	})
}
