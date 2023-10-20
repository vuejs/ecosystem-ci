import fs from 'node:fs'
import path from 'node:path'
import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'quasarframework/quasar',
		branch: 'dev',
		build: 'vue-ecosystem-ci:build',
		// Need to skip QSelect tests until https://github.com/quasarframework/quasar-testing/issues/343 is resolved
		beforeTest: async () => {
			const dir = path.resolve(options.workspace, 'quasar')
			const cypressConfigPath = path.resolve(dir, 'ui/dev/cypress.config.cjs')
			const cypressConfigFile = await fs.promises.readFile(
				cypressConfigPath,
				'utf-8',
			)
			await fs.promises.writeFile(
				cypressConfigPath,
				cypressConfigFile +
					`\nmodule.exports.component.excludeSpecPattern = '../src/components/**/QSelect.cy.js'\n`,
				'utf-8',
			)
		},
		test: 'vue-ecosystem-ci:test',
	})
}
