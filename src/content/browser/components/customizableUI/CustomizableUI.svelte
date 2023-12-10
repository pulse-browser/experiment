<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type {
    Component,
    ComponentId,
    ExportComponent,
  } from '@shared/customizableUI'
  import type { Tab } from '@browser/lib/window/tab'

  import Block from './Block.svelte'
  import IconButton from './IconButton.svelte'
  import Spacer from './Spacer.svelte'
  import BrowserView from './BrowserView.svelte'
  import OmniboxContainer from './OmniboxContainer.svelte'
  import Tabs from './Tabs.svelte'

  export let component: ComponentId & ExportComponent
  export let root: Component
  export let tab: Tab
</script>

{#if component.type === 'block'}
  <Block {component} {root} {tab} />
{:else if component.type === 'icon'}
  <IconButton {component} {root} {tab} />
{:else if component.type === 'spacer'}
  <Spacer {component} {root} />
{:else if component.type === 'browser'}
  <BrowserView {component} {root} />
{:else if component.type === 'omnibox'}
  <OmniboxContainer {component} {root} {tab} />
{:else if component.type === 'tabs'}
  <Tabs {component} {root} />
{/if}
