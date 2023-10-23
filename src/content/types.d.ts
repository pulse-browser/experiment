/// <reference types="gecko-types" />
/// <reference types="svelte" />

declare interface Window {
  windowApi: typeof import('./lib/globalApi').windowApi
}
