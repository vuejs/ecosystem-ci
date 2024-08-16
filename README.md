# Vue Ecosystem CI

This repository is used to run integration tests for vue ecosystem projects

## How it works

We now have continuous release like [this](https://github.com/vuejs/core/runs/28854321865) via [pkg.pr.new](https://github.com/stackblitz-labs/pkg.pr.new). By default when running against a branch or a commit, we will use the corresponding release from `pkg.pr.new` so we don't need to build / mock publish the packages again.

We will use pnpm override to force install the specific version of Vue in the downstream projects and then run their tests.

In cases where we cannot use pre-built packages, the script will perform a fresh build by pulling the specific Vue branch / commit and publish them to a local verdaccio registry.

## via github workflow

### scheduled

Workflows are scheduled to run automatically every Monday, Wednesday and Friday

### manually

- open [workflow](../../actions/workflows/ecosystem-ci-selected.yml)
- click 'Run workflow' button on top right of the list
- select suite to run in dropdown
- start workflow

## via shell script

- clone this repo
- run `pnpm i`
- run `pnpm test` to run all suites
- or `pnpm test <suitename>` to select a suite
- or `tsx ecosystem-ci.ts`

Note if you are not using `pnpm` through `corepack` locally, you need to prepend every command with `COREPACK_ENABLE_STRICT=0 `.

You can pass `--tag v3.2.0-beta.1`, `--branch somebranch` or `--commit abcd1234` option to select a specific vue version to build.
If you pass `--release 3.2.45`, vue build will be skipped and vue is fetched from the registry instead.

The repositories are checked out into `workspace` subdirectory as shallow clones.

If you want to test the same version of vue multiple times, please run `pnpm clean` first to ensure the workspace is clean.

### Running against local build

To run against the local build, link the `packages` directory of a local `vuejs/core` clone to `built-packages` inside this repo, then run with the `--local` option.

### Explicitly running against pkg.pr.new releases

You can run against a specific continuous release via `--release @<commit or branch>`. For example:

```
tsx ecosystem-ci.ts --release @main
tsx ecosystem-ci.ts --release @ca41b9202
```

## how to add a new integration test

- check out the existing [tests](./tests) and add one yourself. Thanks to some utilities it is really easy
- once you are confident the suite works, add it to the lists of suites in the [workflows](../../actions/)

> the current utilities focus on pnpm based projects. Consider switching to pnpm or contribute utilities for other pms

If your project needs some special setup when running in the Ecosystem CI, you can detect the environment by checking for the `ECOSYSTEM_CI` environment variable. It would be set to `vue` if running in the Vue Ecosystem CI.

## reporting results

### on your own server

- Go to `Server settings > Integrations > Webhooks` and click `New Webhook`
- Give it a name, icon and a channel to post to
- copy the webhook url
- get in touch with admins of this repo so they can add the webhook

### how to add a discord webhook here

- Go to `<github repo>/settings/secrets/actions` and click on `New repository secret`
- set `Name` as `DISCORD_WEBHOOK_URL`
- paste the discord webhook url you copied from above into `Value`
- Click `Add secret`
