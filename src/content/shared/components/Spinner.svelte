<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<div class="spinner" />

<style>
  .spinner {
    background-color: var(--active);

    display: block;
    width: 0.75em;
    height: 0.75em;
    border-radius: 0.25em;

    margin: 0.125rem;

    animation-name: spinner;
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }

  @keyframes spinner {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(90deg);
    }
  }
</style>
