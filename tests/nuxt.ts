import { runInRepo } from '../utils.ts'
import { RunOptions } from '../types.ts'

const newMethods = [
	'useTemplateRef',
	'useId',
	'useHost',
	'useShadowRoot',
	'hydrateOnVisible',
	'hydrateOnMediaQuery',
	'hydrateOnInteraction',
	'hydrateOnIdle',
]

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'nuxt/nuxt',
		build: ['dev:prepare', 'typecheck', 'build'],
		beforeTest: ['pnpm playwright-core install chromium'],
		test: ['test:unit', 'test:types', 'test:fixtures'],
		patchFiles: {
			'packages/nuxt/test/treeshake-client.test.ts': (content) => {
				return content
					.replace(/const \[_, scopeId\].*/, '')
					.replace(/expect\(clientResult\)\.toContain\(`pushScopeId\(.*/, '')
					.replace(/expect\(treeshaken\)\.toContain\(`<div \${scopeId}>`\)/, '')
			},
			'packages/nuxt/src/imports/presets.ts': (content) => {
				return content.replace(
					`'useTransitionState',`,
					`'useTransitionState', ${newMethods.map((m) => `'${m}'`).join(',')}`,
				)
			},
		},
	})
}
