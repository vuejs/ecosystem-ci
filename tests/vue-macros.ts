import { runInRepo } from '../utils'
import { RunOptions } from '../types'
import path from 'node:path'
import fs from 'node:fs'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vue-macros/vue-macros',
		branch: 'vue-ecosystem-ci',
		build: 'build',
		async beforeTest() {
			const dir = path.resolve(options.workspace, 'vue-macros')
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
		test: ['test:ecosystem'],
	})
}
