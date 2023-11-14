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

// Default keybinds
pref('browser.keybinds.toolbox', 'accel+alt+shift+I');
pref('browser.keybinds.chrome.reload', 'accel+alt+shift+R');

pref('browser.keybinds.newTab', 'accel+T');
pref('browser.keybinds.closeTab', 'accel+W');
pref('browser.keybinds.nextTab', 'accel+VK_TAB');
pref('browser.keybinds.previousTab', 'accel+shift+VK_TAB');
pref('browser.keybinds.tab1', 'accel+1');
pref('browser.keybinds.tab2', 'accel+2');
pref('browser.keybinds.tab3', 'accel+3');
pref('browser.keybinds.tab4', 'accel+4');
pref('browser.keybinds.tab5', 'accel+5');
pref('browser.keybinds.tab6', 'accel+6');
pref('browser.keybinds.tab7', 'accel+7');
pref('browser.keybinds.tab8', 'accel+8');
pref('browser.keybinds.findInPage', 'accel+F');

// Behaviour prefs
pref('browser.tabs.newTabFocus', false);

// =======================================================
// Gecko prefs

// Findbar
pref('accessibility.typeaheadfind', false);
pref('accessibility.typeaheadfind.timeout', 5000);
pref('accessibility.typeaheadfind.linksonly', false);
pref('accessibility.typeaheadfind.flashBar', 1);

// Enable firefox compat
pref('general.useragent.compatMode.firefox', true);
