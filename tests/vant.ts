import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'
import fs from 'node:fs'
import path from 'node:path'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'youzan/vant',
		branch: 'main',
		build: 'build',
		test: 'test',
		async beforeTest() {
			fs.rmSync(
				path.join(
					options.workspace,
					'vant/packages/vant/src/col/test/demo-ssr.spec.ts',
				),
			)
		},
	})
}
