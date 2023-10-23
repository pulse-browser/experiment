export function lazyESModuleGetters(modules) {
    const lazy = {};
    ChromeUtils.defineESModuleGetters(lazy, modules);
    return lazy;
}
