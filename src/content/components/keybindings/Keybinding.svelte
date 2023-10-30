<script lang="ts">
  import { onMount } from 'svelte'
  import { type Keybind, keybindFromString } from '../../lib/keybinds'
  import { observable } from '../../lib/xul/observable'

  export let pref: string
  let keybind: Keybind = keybindFromString(
    Services.prefs.getStringPref(pref, '')
  ).unwrap()

  onMount(() => {
    const observer = observable(
      () =>
        (keybind = keybindFromString(
          Services.prefs.getStringPref(pref, '')
        ).unwrap())
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
