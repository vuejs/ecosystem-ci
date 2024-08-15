import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { cac } from 'cac'

import {
	setupEnvironment,
	teardownEnvironment,
	setupVueRepo,
	buildVue,
	bisectVue,
	parseVueVersion,
} from './utils.ts'
import { CommandOptions, RunOptions } from './types.ts'

const cli = cac()
cli
	.command('[...suites]', 'build vue and run selected suites')
	.option('--verify', 'verify checkouts by running tests', { default: false })
	.option('--repo <repo>', 'vue repository to use', { default: 'vuejs/core' })
	.option('--branch <branch>', 'vue branch to use', { default: 'main' })
	.option('--tag <tag>', 'vue tag to use')
	.option('--commit <commit>', 'vue commit sha to use')
	.option('--release <version>', 'vue release to use from npm registry')
	.option('--local', 'test locally')
	.action(async (suites, options: CommandOptions) => {
		const { root, vuePath, workspace } = await setupEnvironment()
		const suitesToRun = getSuitesToRun(suites, root)
		let vueVersion

		// Need to setup the Vue repo to get the package names
		await setupVueRepo(options)

		if (options.release) {
			vueVersion = options.release
		} else {
			if (!options.local) {
				await buildVue({ verify: options.verify, publish: true })
			}
			vueVersion = parseVueVersion(vuePath)
		}

		const runOptions: RunOptions = {
			root,
			vuePath,
			vueVersion,
			workspace,
			release: options.release,
			verify: options.verify,
			skipGit: false,
		}
		for (const suite of suitesToRun) {
			await run(suite, runOptions)
		}
		await teardownEnvironment()
	})

cli
	.command('build-vue', 'build vue only')
	.option('--verify', 'verify vue checkout by running tests', {
		default: false,
	})
	.option('--publish', 'publish the built vue packages to the local registry', {
		default: false,
	})
	.option('--repo <repo>', 'vue repository to use', { default: 'vuejs/core' })
	.option('--branch <branch>', 'vue branch to use', { default: 'main' })
	.option('--tag <tag>', 'vue tag to use')
	.option('--commit <commit>', 'vue commit sha to use')
	.action(async (options: CommandOptions) => {
		await setupEnvironment()
		await setupVueRepo(options)
		await buildVue({ verify: options.verify, publish: options.publish })
		await teardownEnvironment()
	})

cli
	.command(
		'run-suites [...suites]',
		'run single suite with pre-built and locally-published vue',
	)
	.option(
		'--verify',
		'verify checkout by running tests before using local vue',
		{ default: false },
	)
	.option('--repo <repo>', 'vue repository to use', { default: 'vuejs/core' })
	.option('--release <version>', 'vue release to use from npm registry')
	.action(async (suites, options: CommandOptions) => {
		const { root, vuePath, workspace } = await setupEnvironment()
		const suitesToRun = getSuitesToRun(suites, root)
		const runOptions: RunOptions = {
			...options,
			root,
			vuePath,
			vueVersion: parseVueVersion(vuePath),
			workspace,
		}
		for (const suite of suitesToRun) {
			await run(suite, runOptions)
		}
		await teardownEnvironment()
	})

cli
	.command(
		'bisect [...suites]',
		'use git bisect to find a commit in vue that broke suites',
	)
	.option('--good <ref>', 'last known good ref, e.g. a previous tag. REQUIRED!')
	.option('--verify', 'verify checkouts by running tests', { default: false })
	.option('--repo <repo>', 'vue repository to use', { default: 'vuejs/core' })
	.option('--branch <branch>', 'vue branch to use', { default: 'main' })
	.option('--tag <tag>', 'vue tag to use')
	.option('--commit <commit>', 'vue commit sha to use')
	.action(async (suites, options: CommandOptions & { good: string }) => {
		if (!options.good) {
			console.log(
				'you have to specify a known good version with `--good <commit|tag>`',
			)
			process.exit(1)
		}
		const { root, vuePath, workspace } = await setupEnvironment()
		const suitesToRun = getSuitesToRun(suites, root)
		let isFirstRun = true
		const { verify } = options
		const runSuite = async () => {
			try {
				await buildVue({ verify: isFirstRun && verify, publish: true })
				for (const suite of suitesToRun) {
					await run(suite, {
						verify: !!(isFirstRun && verify),
						skipGit: !isFirstRun,
						root,
						vuePath,
						vueVersion: parseVueVersion(vuePath),
						workspace,
					})
				}
				isFirstRun = false
				return null
			} catch (e) {
				return e
			}
		}
		await setupVueRepo({ ...options, shallow: false })
		const initialError = await runSuite()
		if (initialError) {
			await bisectVue(options.good, runSuite)
		} else {
			console.log(`no errors for starting commit, cannot bisect`)
		}
		await teardownEnvironment()
	})
cli.help()
cli.parse()

async function run(suite: string, options: RunOptions) {
	const { test } = await import(`./tests/${suite}.ts`)
	await test({
		...options,
		workspace: path.resolve(options.workspace, suite),
	})
}

function getSuitesToRun(suites: string[], root: string) {
	let suitesToRun: string[] = suites
	const availableSuites: string[] = fs
		.readdirSync(path.join(root, 'tests'))
		.filter((f: string) => !f.startsWith('_') && f.endsWith('.ts'))
		.map((f: string) => f.slice(0, -3))
	availableSuites.sort()
	if (suitesToRun.length === 0) {
		suitesToRun = availableSuites
	} else {
		const invalidSuites = suitesToRun.filter(
			(x) => !x.startsWith('_') && !availableSuites.includes(x),
		)
		if (invalidSuites.length) {
			console.log(`invalid suite(s): ${invalidSuites.join(', ')}`)
			console.log(`available suites: ${availableSuites.join(', ')}`)
			process.exit(1)
		}
	}
	return suitesToRun
}
