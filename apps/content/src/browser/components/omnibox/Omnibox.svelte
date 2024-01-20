<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type { Suggestion } from '@shared/search/suggestions'
  import { resource } from '@browser/lib/resources'
  import type { Tab } from '@browser/lib/window/tab'

  import Bookmarks from './Bookmarks.svelte'
  import { pageActions } from '@browser/lib/modules/EPageActionsBindings'
  import PageAction from './PageAction.svelte'
  import ZoomDisplay from './ZoomDisplay.svelte'

  const suggestionsModule = import('@shared/search/suggestions')

  export let tab: Tab

  let inputContent: string = ''
  let inputElement: HTMLInputElement
  let suggestions: Suggestion[] = []
  let selectedSuggestion = 0
  let selectionChange = false

  $: focusedOmnibox = tab.focusedOmnibox
  $: uri = tab.uri
  $: zoom = tab.zoom

  const setSuggestions = (query: string) => (s: Suggestion[]) => {
    if (query != inputContent) return
    suggestions = s
    selectedSuggestion = Math.max(
      Math.min(selectedSuggestion, suggestions.length - 1),
      0,
    )
  }

  async function generateSuggestions() {
    const { suggestions: suggestionsMethod } = await suggestionsModule
    const { fast, full } = suggestionsMethod(inputContent)

    fast.then(setSuggestions(inputContent))
    full.then(setSuggestions(inputContent))
  }

  function updateFocus(shouldBeFocused: boolean, url: string) {
    inputContent = url
    if (!inputElement) return

    const isFocused = document.activeElement === inputElement
    if (isFocused === shouldBeFocused) return

    if (shouldBeFocused) {
      inputElement.focus()
      setTimeout(() => inputElement.select(), 100)
    } else {
      inputElement.blur()
      suggestions = []
    }
  }

  $: updateFocus($focusedOmnibox, $uri.asciiSpec)
</script>

<div class="container">
  <div class="omnibox">
    <div class="input__container">
      <input
        class="input"
        type="text"
        aria-autocomplete="list"
        aria-owns="omnibox__suggestions-list"
        bind:this={inputElement}
        bind:value={inputContent}
        on:focusin={() => {
          focusedOmnibox.set(true)
          selectionChange = false
          generateSuggestions()
        }}
        on:blur|capture={() => setTimeout(() => focusedOmnibox.set(false), 100)}
        on:mouseup={(_) => {
          if (!selectionChange) inputElement.select()
        }}
        on:selectionchange={() => {
          selectionChange = true
        }}
        on:keyup={async (e) => {
          if (e.key === 'Enter') {
            focusedOmnibox.set(false)
            return tab.goToUri(
              resource.NetUtil.newURI(suggestions[selectedSuggestion].url),
            )
          }

          if (e.key === 'ArrowDown') {
            e.preventDefault()
            selectedSuggestion = Math.min(
              selectedSuggestion + 1,
              suggestions.length - 1,
            )
            return
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault()
            selectedSuggestion = Math.max(selectedSuggestion - 1, 0)
            return
          }

          await generateSuggestions()
        }}
      />

      <ZoomDisplay zoom={$zoom} on:click={() => zoom.set(1)} />

      {#each $pageActions as [_extId, pageAction]}
        {#if pageAction.shouldShow($uri.asciiSpec, tab.getTabId())}
          <PageAction {pageAction} />
        {/if}
      {/each}

      <Bookmarks {tab} />
    </div>

    <div
      class="suggestions"
      id="omnibox__suggestions-list"
      hidden={!$focusedOmnibox}
      role="listbox"
    >
      {#each suggestions as suggestion, index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="suggestion"
          role="option"
          tabindex="-1"
          aria-posinset={index}
          aria-setsize={suggestions.length}
          aria-selected={index === selectedSuggestion}
          on:click={(_) => {
            tab.goToUri(resource.NetUtil.newURI(suggestion.url))
            focusedOmnibox.set(false)
          }}
        >
          {suggestion.title}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .container {
    position: relative;
    flex-grow: 1;
  }

  .omnibox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    padding: 0 0.5rem;
    border-radius: 0.5rem;
    background: var(--base);
  }

  .input__container {
    display: flex;
    align-items: center;
    height: 2.5rem;
    margin-right: -0.25rem;
  }

  .input {
    flex-grow: 1;
    border: none;
    background: none;
    margin: 0;
    outline: none !important;
  }

  .suggestions {
    margin-bottom: 0.5rem;
  }

  .suggestion {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .suggestion:hover {
    background: var(--surface-1);
  }
  .suggestion[aria-selected='true'] {
    background: var(--surface-2);
  }
</style>
