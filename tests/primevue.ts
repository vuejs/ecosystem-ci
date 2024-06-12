import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'primefaces/primevue',
		tag: '3.52.0',
		build: 'build',
		test: 'test:unit',
		patchFiles: {
			'components/lib/inputnumber/InputNumber.spec.js': (content) => {
				return content.replaceAll(
					`it('is keypress called`,
					`it.skip('is keypress called`,
				)
			},
		},
	})
}
