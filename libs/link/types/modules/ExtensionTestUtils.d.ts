declare module 'resource://app/modules/ExtensionTestUtils.d.ts' {
  export type ExtensionTestAssertions = {
    getPersistentListeners(extWrapper, apiNs, apiEvent)
    assertPersistentListeners(
      extWrapper,
      apiNs,
      apiEvent,
      options: { primed; persisted: boolean; primedListenersCount },
    )
  }

  export const ExtensionTestUtils: {
    getBackgroundServiceWorkerEnabled(): boolean
    isInBackgroundServiceWorkerTests(): boolean

    testAssertions: ExtensionTestAssertions

    loadExtension()
  }
}
