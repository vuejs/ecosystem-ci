import { runInRepo } from '../utils'
import { RunOptions } from '../types'
import path from 'node:path'
import fs from 'node:fs'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vuetifyjs/vuetify',
		branch: 'master',
		build: 'yarn workspace vuetify run build',
		async beforeTest() {
			const dir = path.resolve(options.workspace, 'vuetify')
			const filePath = path.resolve(dir, 'tsconfig.base.json')
			const file = fs.readFileSync(filePath, 'utf-8')
			fs.writeFileSync(
				filePath,
				file.replace(
					'"jsx": "preserve",',
					'"jsx": "preserve",\n  "jsxImportSource": "vue",',
				),
			)
		},
		// there's also an e2e test script in vuetify,
		// but it seems flaky, so I skipped it for now
		test: ['yarn lerna run test:coverage -- -- -i'],
	})
}
