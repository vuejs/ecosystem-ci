import fs from 'node:fs'
import path from 'node:path'
import { getVuePackages, runInRepo } from '../utils.ts'
import { Overrides, RunOptions } from '../types.ts'
import { REGISTRY_ADDRESS } from '../registry.ts'

const TEMPLATE = 'vue3-vite/default-ts'

export async function test(options: RunOptions): Promise<void> {
	await runInRepo({
		...options,
		repo: 'storybookjs/storybook',
		branch: 'next',
		overrides: options.release ? {} : await getLocalTarballOverrides(),
		// Storybook skips sandbox generation when one exists, which would keep stale Vue resolutions.
		beforeBuild: async () =>
			fs.promises.rm(path.resolve(options.workspace, 'storybook-sandboxes'), {
				recursive: true,
				force: true,
			}),
		build: `./scripts/ecosystem-ci/build.sh ${TEMPLATE} vue3`,
		beforeTest: `./scripts/ecosystem-ci/before-test.sh ${TEMPLATE}`,
		test: `./scripts/ecosystem-ci/test.sh ${TEMPLATE}`,
	})
}

/**
 * Sorry we're using Yarn 4 here :( which ignors `.npmrc` and enforces `npmMinimalAgeGate`, so we have to pin each Vue package to its tarball URL instead.
 */
async function getLocalTarballOverrides(): Promise<Overrides> {
	const packages = await getVuePackages()
	return Object.fromEntries(
		packages.map(({ name, hashedVersion }) => {
			const basename = name.slice(name.lastIndexOf('/') + 1)
			return [
				name,
				`${REGISTRY_ADDRESS}${name}/-/${basename}-${hashedVersion}.tgz`,
			]
		}),
	)
}
