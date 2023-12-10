/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export interface WindowConfiguration {
  /**
   * The initial page to show when the window is opened
   */
  initialUrl: string
}

const defaultWindowConfiguration: WindowConfiguration = {
  initialUrl: Services.prefs.getStringPref(
    'browser.newwindow.default',
    'about:blank',
  ),
}

/**
 * These are the arguments that we want to pass between windows.
 */
export type WindowArguments = Partial<WindowConfiguration>

export function getFullWindowConfiguration(
  args: WindowArguments,
): WindowConfiguration {
  return {
    ...defaultWindowConfiguration,
    ...args,
  }
}

export function nsISupportsWinArgs(
  args: WindowArguments,
): WindowArguments & nsISupportsType {
  return args as unknown as WindowArguments & nsISupportsType
}
