import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vuejs/language-tools',
		branch: 'master',
		beforeBuild: 'pnpm dedupe',
		build: 'build',
		test: 'test',
		patchFiles: {
			'package.json': (content) => {
				const pkg = JSON.parse(content)
				// As of 2024-03-19,
				// the version of TypeScript in the package.json is latest, which resolves to 5.4.2 if we dedupe it.
				// The new feature in TypeScript 5.4,
				// [Preserved Narrowing in Closures Following Last Assignments](https://devblogs.microsoft.com/typescript/announcing-typescript-5-4/#preserved-narrowing-in-closures-following-last-assignments),
				// would cause a type error at <https://github.com/vuejs/language-tools/blob/58a820281d4b4a8b2d484a7fa2a2eb73e5eb4daf/packages/language-service/lib/plugins/vue-document-drop.ts#L88>.
				// There are also other tests broken by TypeScript 5.4.
				// So we need to pin the version to ~5.3.3.
				pkg.devDependencies.typescript = '~5.3.3'
				return JSON.stringify(pkg, null, 2)
			},
		},
	})
}
