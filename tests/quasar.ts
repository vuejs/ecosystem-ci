import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'quasarframework/quasar',
		branch: 'dev',
		build: 'vue-ecosystem-ci:build',
		test: 'vue-ecosystem-ci:test',
		// Need to skip QSelect tests until https://github.com/quasarframework/quasar-testing/issues/343 is resolved
		patchFiles: {
			'ui/dev/cypress.config.cjs': (content) =>
				content +
				`
					module.exports.component.excludeSpecPattern = [
						'../src/components/**/QSelect.cy.js',
						'../src/composables/**/use-validate.cy.js'
					]
					`,
		},
	})
}
