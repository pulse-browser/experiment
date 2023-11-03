<div align="center">

# Helix

Just another Gecko browser...

</div>

## Overall goals

- [x] For a developer with `pnpm` and `node`, clone to starting development should be under 2 minutes.
- [ ] Should be easy to contribute to for someone with Svelte experience & limited knowledge of Gecko
- [ ] Extension API support

## Testing build artifacts

If you wish to test the browser, you can find build artifacts for Linux under Github actions. To run:

1. Find the [latest Github actions run](https://github.com/pulse-browser/experiment/actions/workflows/main.yml?query=branch%3Aartifact-based-browser) (making sure its on the correct branch)
2. Download the artifact called `testing_browser`
3. Extract the artifact
4. Run with `./quark-runtime -no-remote`

## Build instructions

Ensure that the following are installed before continuing:

- A maintained version of nodejs
- Linux
- [pnpm](https://pnpm.io/installation)

To get a dev server running:

```bash
pnpm i
pnpm dev
```

Then launch (whilst the dev server is running):

```bash
pnpm app:start
```
