<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { onMount } from 'svelte'
  import { observable } from '@experiment/shared'
  import { type Keybind, keybindFromString } from '../../lib/keybinds'

  export let pref: string
  let keybind: Keybind = keybindFromString(
    Services.prefs.getStringPref(pref, ''),
  ).unwrap()

  onMount(() => {
    const observer = observable(
      () =>
        (keybind = keybindFromString(
          Services.prefs.getStringPref(pref, ''),
        ).unwrap()),
    )

    Services.prefs.addObserver(pref, observer)
    return () => Services.prefs.removeObserver(pref, observer)
  })
</script>

<xul:key
  modifiers={keybind.modifiers.join(' ')}
  key={keybind.key}
  keycode={keybind.keycode}
  on:command
/>
