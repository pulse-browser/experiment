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

  const suggestionsModule = import('@shared/search/suggestions')

  export let tab: Tab

  let showFocus = false
  let inputContent: string = ''
  let inputElement: HTMLInputElement
  let suggestions: Suggestion[] = []
  let selectedSuggestion = 0

  $: uri = tab.uri

  async function generateSuggestions() {
    const { suggestions: suggestionsMethod } = await suggestionsModule
    suggestions = await suggestionsMethod(inputContent)
    selectedSuggestion = Math.max(
      Math.min(selectedSuggestion, suggestions.length - 1),
      0,
    )
  }

  const unbindedSetInputContent = (value: string) => {
    inputContent = value
    if (tab.tabJustOpened && inputElement) {
      inputElement.focus()
      inputElement.select()
      tab.tabJustOpened = false
      return
    }

    // Unfocus on spec change
    if (inputElement && suggestions.length != 0) {
      inputElement.blur()
      suggestions = []
    }
  }
  $: unbindedSetInputContent($uri.asciiSpec)
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
          showFocus = true
          generateSuggestions()
        }}
        on:blur|capture={() =>
          setTimeout(() => (showFocus = false) && (suggestions = []), 100)}
        on:keyup={async (e) => {
          if (e.key === 'Enter')
            return tab.goToUri(
              resource.NetUtil.newURI(suggestions[selectedSuggestion].url),
            )
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

      {#each $pageActions as [_extId, pageAction]}
        {#if pageAction.shouldShow($uri.asciiSpec, tab.getTabId())}
          <PageAction {pageAction} />
        {/if}
      {/each}

      <Bookmarks {tab} />
    </div>

    <div
      class="suggestions"
      hidden={!showFocus}
      id="omnibox__suggestions-list"
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
            inputElement.blur()
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
  }

  .suggestion:hover {
    background: var(--surface-1);
  }
  .suggestion[aria-selected='true'] {
    background: var(--surface-2);
  }
</style>
