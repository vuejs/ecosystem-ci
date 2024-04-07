import { runInRepo } from '../utils'
import { RunOptions } from '../types'

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'vuetifyjs/vuetify',
		branch: 'master',
		build: 'yarn workspace vuetify run build',
		// there's also an e2e test script in vuetify,
		// but it seems flaky, so I skipped it for now
		test: ['yarn lerna run test:coverage -- -- -i'],
		patchFiles: {
			'package.json': (content) => {
				const pkg = JSON.parse(content)
				// As of 2024-03-21, the version of source-map-js from vuetify isn't the same as the one from vue core.
				// Therefore a "Duplicate identifier" TS error occurs when building.
				// But we can't run dedupe in the vuetify repo, as the build would fail, too.
				// So we need to overwrite the version to ^1.1.0 to avoid duplications of the dependency.
				pkg.resolutions ??= {}
				pkg.resolutions['source-map-js'] = '^1.2.0'
				return JSON.stringify(pkg, null, 2)
			},
		},
	})
}
