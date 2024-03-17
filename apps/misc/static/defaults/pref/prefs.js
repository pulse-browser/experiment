/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global pref */

// This is roughly equivelent to `user.js` or `firefox.js`

// Home settings
pref('browser.newwindow.default', 'about:blank');
pref('browser.newtab.default', 'https://web.tabliss.io/');

// Search settings
pref('browser.search.engine.default', 'google@search.fushra.com');

// Context menu prefs
pref(
  'browser.contextmenus.page',
  'link__copy,link__new-tab,separator,selection__copy'
);
pref(
  'browser.uiCustomization.state',
  '{"type":"block","direction":"vertical","content":[{"type":"block","direction":"horizontal","size":{"type":"content"},"content":[{"type":"tabs"}],"color":"base"},{"type":"block","direction":"horizontal","size":{"type":"content"},"content":[{"type":"icon","icon":"arrow-left-line"},{"type":"icon","icon":"refresh-line"},{"type":"icon","icon":"arrow-right-line"},{"type":"spacer","grow":1},{"type":"omnibox"},{"type":"spacer","grow":1},{"type":"icon","icon":"menu-line"}],"color":"surface-0"},{"type":"browser"}],"size":{"type":"grow","value":1},"color":"base"}'
);

// Default keybinds
pref('browser.keybinds.toolbox', 'accel+alt+shift+I');
pref('browser.keybinds.chrome.reload', 'accel+alt+shift+R');

pref('browser.keybinds.newWindow', 'accel+N');
pref('browser.keybinds.newTab', 'accel+T');
pref('browser.keybinds.closeTab', 'accel+W');
pref('browser.keybinds.refreshTab', 'accel+R');
pref('browser.keybinds.nextTab', 'accel+VK_TAB');
pref('browser.keybinds.previousTab', 'accel+shift+VK_TAB');
pref('browser.keybinds.zoomIn', 'accel+=');
pref('browser.keybinds.zoomOut', 'accel+-');
pref('browser.keybinds.zoomReset', 'accel+0');
pref('browser.keybinds.tab1', 'accel+1');
pref('browser.keybinds.tab2', 'accel+2');
pref('browser.keybinds.tab3', 'accel+3');
pref('browser.keybinds.tab4', 'accel+4');
pref('browser.keybinds.tab5', 'accel+5');
pref('browser.keybinds.tab6', 'accel+6');
pref('browser.keybinds.tab7', 'accel+7');
pref('browser.keybinds.tab8', 'accel+8');
pref('browser.keybinds.findInPage', 'accel+F');

// Misc. prefs
pref('browser.tabs.newTabFocus', false);

// TODO:
pref('app.support.baseURL', 'https://example.com/');

// =======================================================
// Gecko prefs

// Findbar
pref('accessibility.typeaheadfind', false);
pref('accessibility.typeaheadfind.timeout', 5000);
pref('accessibility.typeaheadfind.linksonly', false);
pref('accessibility.typeaheadfind.flashBar', 1);

// Enable firefox compat
pref('general.useragent.compatMode.firefox', true);

// Downloads

// Enable logging downloads operations to the Console.
pref('browser.download.loglevel', 'Error');

// Number of milliseconds to wait for the http headers (and thus
// the Content-Disposition filename) before giving up and falling back to
// picking a filename without that info in hand so that the user sees some
// feedback from their action.
pref('browser.download.saveLinkAsFilenameTimeout', 4000);

pref('browser.download.useDownloadDir', true);
pref('browser.download.folderList', 1);
pref('browser.download.manager.addToRecentDocs', true);
pref('browser.download.manager.resumeOnWakeDelay', 10000);

// This records whether or not the panel has been shown at least once.
pref('browser.download.panel.shown', false);

// This records whether or not to show the 'Open in system viewer' context menu item when appropriate
pref('browser.download.openInSystemViewerContextMenuItem', true);

// This records whether or not to show the 'Always open...' context menu item when appropriate
pref('browser.download.alwaysOpenInSystemViewerContextMenuItem', true);

// Open downloaded file types internally for the given types.
// This is a comma-separated list, the empty string ("") means no types are
// viewable internally.
pref(
  'browser.download.viewableInternally.enabledTypes',
  'xml,svg,webp,avif,jxl'
);

// This controls whether the button is automatically shown/hidden depending
// on whether there are downloads to show.
pref('browser.download.autohideButton', true);

// Controls whether to open the downloads panel every time a download begins.
// The first download ever run in a new profile will still open the panel.
pref('browser.download.alwaysOpenPanel', true);

// Determines the behavior of the "Delete" item in the downloads context menu.
// Valid values are 0, 1, and 2.
//   0 - Don't remove the download from session list or history.
//   1 - Remove the download from session list, but not history.
//   2 - Remove the download from both session list and history.
pref('browser.download.clearHistoryOnDelete', 0);

// We do this because we want page actions etc. to have color schemes
pref('svg.context-properties.content.enabled', true);

// Security page preferences
// This requires our own testing server, which we don't have
pref('security.certerrors.mitm.priming.enabled', true);

pref('browser.display.use_system_colors', true);

// =============================================================================
// Multithreading

pref('browser.tabs.remote.autostart', true);
pref('browser.tabs.remote.separatePrivilegedContentProcess', true);
pref('browser.tabs.remote.separatePrivilegedMozillaWebContentProcess', true);

pref('extensions.webextensions.remote', true);
pref('extensions.webextensions.protocol.remote', true);
