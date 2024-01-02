/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

declare function closeWindow(aClose, aPromptFunction, aSource)

/**
 * @depends @mozilla.org/browser/browserglue;1
 */
declare function canQuitApplication(aData, aSource)

/**
 * @depends @mozilla.org/browser/browserglue;1
 */
declare function goQuitApplication(event)

declare function goUpdateCommand(aCommand: string)

declare function goDoCommand(aCommand: string)

declare function goSetCommandEnabled(aID, aEnabled)
