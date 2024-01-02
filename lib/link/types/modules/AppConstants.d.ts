/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

type AppConstantsContents = {
  readonly NIGHTLY_BUILD: boolean
  readonly RELEASE_OR_BETA: boolean
  readonly EARLY_BETA_OR_EARLIER: boolean
  readonly IS_ESR: boolean
  readonly ACCESSIBILITY: boolean
  readonly MOZILLA_OFFICIAL: boolean
  readonly MOZ_OFFICIAL_BRANDING: boolean
  readonly MOZ_DEV_EDITION: boolean
  readonly MOZ_SERVICES_SYNC: boolean
  readonly MOZ_SERVICES_HEALTHREPORT: boolean
  readonly MOZ_DATA_REPORTING: boolean
  readonly MOZ_SANDBOX: boolean
  readonly MOZ_TELEMETRY_REPORTING: boolean
  readonly MOZ_TELEMETRY_ON_BY_DEFAULT: boolean
  readonly MOZ_UPDATER: boolean
  readonly MOZ_SWITCHBOARD: boolean
  readonly MOZ_WEBRTC: boolean
  readonly MOZ_WIDGET_GTK: boolean
  readonly MOZ_WMF_CDM: boolean
  readonly XP_UNIX: boolean
  readonly platform: string
  readonly unixstyle: boolean

  isPlatformAndVersionAtLeast(platform: string, version: string): boolean
  isPlatformAndVersionAtMost(platform: string, version: string): boolean

  readonly MOZ_CRASHREPORTER: boolean
  readonly MOZ_NORMANDY: boolean
  readonly MOZ_MAINTENANCE_SERVICE: boolean
  readonly MOZ_BACKGROUNDTASKS: boolean
  readonly MOZ_UPDATE_AGENT: boolean
  readonly MOZ_BITS_DOWNLOAD: boolean
  readonly DEBUG: boolean
  readonly ASAN: boolean
  readonly ASAN_REPORTER: boolean
  readonly TSAN: boolean
  readonly MOZ_SYSTEM_NSS: boolean
  readonly MOZ_PLACES: boolean
  readonly MOZ_REQUIRE_SIGNING: boolean
  readonly MOZ_UNSIGNED_SCOPES: number
  readonly MOZ_ALLOW_ADDON_SIDELOAD: boolean
  readonly MOZ_WEBEXT_WEBIDL_ENABLED: boolean
  readonly MENUBAR_CAN_AUTOHIDE: boolean
  readonly MOZ_ANDRIOD_HISTORY: boolean
  readonly MOZ_GECKO_PROFILER: boolean

  readonly DLL_PREFIX: string
  readonly DLL_SUFFIX: string
  readonly MOZ_APP_NAME: string
  readonly MOZ_APP_BASENAME: string
  /**
   * @deprecated use brandShortName/brand-short-name instead
   */
  readonly MOZ_APP_DISPLAYNAME_DO_NOT_USE: string
  readonly MOZ_APP_VERSION: string
  readonly MOZ_APP_VERSION_DISPLAY: string
  readonly MOZ_BUILDID: string
  readonly MOZ_BUILD_APP: string
  readonly MOZ_MACBUNDLE_ID: string
  readonly MOZ_MACBUNDLE_NAME: string
  readonly MOZ_UPDATE_CHANNEL: string
  readonly MOZ_WIDGET_TOOLKIT: string
  readonly ANDROID_PACKAGE_NAME: string

  readonly DEBUG_JS_MODULES: string

  readonly MOZ_BING_API_CLIENTID: string
  readonly MOZ_BING_API_KEY: string
  readonly MOZ_GOOGLE_LOCATION_SERVICE_API_KEY: string
  readonly MOZ_GOOGLE_SAFEBROWSING_API_KEY: string
  readonly MOZ_MOZILLA_API_KEY: string

  readonly BROWSER_CHROME_URL: string

  readonly OMNIJAR_NAME: string

  readonly HAVE_SHELL_SERVICE: boolean
  readonly MOZ_CODE_COVERAGE: boolean
  readonly TELEMETRY_PING_FORMAT_VERSION: string
  readonly MOZ_NEW_NOTIFICATION_STORE: boolean
  readonly ENABLE_WEBDRIVER: boolean
  readonly REMOTE_SETTINGS_SERVER_URL: string
  readonly REMOTE_SETTINGS_VERIFY_SIGNATURE: boolean
  readonly REMOTE_SETTINGS_DEFAULT_BUCKET: string
  readonly MOZ_GLEAN_ANDROID: boolean
  readonly MOZ_JXL: boolean
  readonly MOZ_CAN_FOLLOW_SYSTEM_TIME: boolean
  readonly MOZ_SYSTEM_POLICIES: boolean
}

declare module 'resource://gre/modules/AppConstants.sys.mjs' {
  export const AppConstants: AppConstantsContents
}

declare interface MozESMExportFile {
  AppConstants: 'resource://gre/modules/AppConstants.sys.mjs'
}

declare interface MozESMExportType {
  AppConstants: typeof import('resource://gre/modules/AppConstants.sys.mjs').AppConstants
}
