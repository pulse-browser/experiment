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
