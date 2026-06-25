import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'radix-vue/radix-vue',
		branch: 'v2',
		// Vue overrides can make pnpm link Vitest 4 against Histoire's Vite 5 peer set.
		patchFiles: {
			'package.json': (content) => {
				const pkg = JSON.parse(content)
				pkg.devDependencies ||= {}
				pkg.devDependencies.vite = '8.0.16'
				pkg.devDependencies.vitest = '4.1.8'
				return `${JSON.stringify(pkg, null, 2)}\n`
			},
		},
		test: 'test',
	})
}
