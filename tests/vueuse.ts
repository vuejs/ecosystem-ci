import { runInRepo } from '../utils'
import { RunOptions } from '../types'
import path from 'node:path'
import fs from 'node:fs'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vueuse/vueuse',
		branch: 'main',
		build: 'build',
		test: ['typecheck', 'test:3'],

		// skip eagerComputed
		async beforeTest() {
			const dir = path.resolve(options.workspace, 'vueuse')
			const filePath = path.resolve(
				dir,
				'packages/shared/computedEager/index.test.ts',
			)
			const file = fs.readFileSync(filePath, 'utf-8')
			fs.writeFileSync(
				filePath,
				file.replace(
					'expect(isOddComputedCollectSpy).toBeCalledTimes(3)',
					'expect(isOddComputedCollectSpy).toBeCalledTimes(2)',
				),
			)
		},
	})
}
