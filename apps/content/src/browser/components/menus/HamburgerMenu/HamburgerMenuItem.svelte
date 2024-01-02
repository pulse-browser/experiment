<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<button on:click>
  <slot />
</button>

<style>
  button {
    display: block;
    width: 100%;

    padding: 0.25rem 1rem;

    border: none;
    border-radius: 0.25rem;
  }
</style>
