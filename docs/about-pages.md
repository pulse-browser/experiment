# Custom about pages

1. You need to update the [runtime](https://github.com/pulse-browser/experiment-runtime/blob/main/src/quark-runtime/components/components.conf) component to include the contract `@mozilla.org/network/protocol/about;1?what=<page_name>`. You will need to wait for CI to build or use `rt:slink`
2. Add your page to `redirectMap` inside of `AboutRedirector.sys.mjs`
