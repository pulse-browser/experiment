<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import snarkdown from 'snarkdown'

  let licenses: Promise<
    {
      name: string
      version: string
      author?: string
      repository?: string
      source: string
      license: string
      licenseText: string
    }[]
  > = fetch('chrome://browser/content/oss-licenses.json').then((res) =>
    res.json(),
  )
</script>

<p>
  For information about binary licenses, see <a href="about:licenses"
    >about:licenses</a
  >
</p>

<h2>UI Libraries</h2>
<p>
  These are libraries that were used to generate the UI components of the
  browser. This is anything located at <code>chrome://browser/content/**</code>
</p>

{#await licenses then packages}
  <ul>
    {#each packages as pkg}
      <li><a href={`#${pkg.name.replaceAll('@', '')}`}>{pkg.name}</a></li>
    {/each}
  </ul>

  {#each packages as pkg}
    <div id={pkg.name.replaceAll('@', '')}>
      <h3>{pkg.name}@{pkg.version}</h3>
      <p>
        Author: {pkg.author || 'Unknown'}, {#if pkg.repository}
          <a href={pkg.repository}>Repo</a>,
        {/if} <a href={pkg.source}>NPM</a>, License: {pkg.license}
      </p>

      {@html snarkdown(pkg.licenseText || 'No license text provided')}
    </div>
  {/each}
{/await}

<style>
  :global(body) {
    overflow: scroll;
  }
</style>
