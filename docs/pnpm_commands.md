# An overview of pnpm commands

## `postinstall`

This runs after your install. It is responsible for initially transpiling typescript down into javascript. It also initially downloads and sets up the latest version of the runtime.

## `scripts:build`

(Re)builds all the typescript files in `./scripts/`. The output files are placed in `./.scripts/`

## `script:setup`

Downloads & unpacks the latest artifact from GitHub.

## `app:start`

Starts the application binary downloaded from GitHub. You should run `pnpm dev` at the same time.

## `dev`

Starts a webpack dev server.

## `dev:slink`

Sets up a janky symlink between `.store` (the location where artifact downloads are stored) and a correctly setup `experiment-runtime`. To setup:

1. Download and build the experiment-runtime repo in `../experiment-runtime`
2. Use `pnpm gluon package` to package the repo (will likely error, but that is fine)
3. Run `pnpm script:setup` in this repo to sync the changes

On change:

1. In experiment-runtime run:
2. `pnpm gluon build`
3. `pnpm gluon package`
4. In this repo run `pnpm script:setup`
5. Restart the app

Technical notes:

- The symlink path is relative to `.store`
