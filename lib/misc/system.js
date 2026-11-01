/**
 * `true` if system is a MacOS
 * @type {Boolean}
 */
export const isMac = $.os.indexOf('Windows') === -1

/**
 * `true` if system is a Windows
 * @type {Boolean}
 */
export const isWindows = $.os.indexOf('Windows') !== -1

/**
 * @see getSystemInfo
 * @function
 */
export const isWin = isWindows

/**
 * Gets a string containing current OS, AE version and AE language
 * @method
 * @return {string} String containing current OS, AE version and AE language
 */
export function getSystemInfo() {
	return $.os + ' AE ' + app.version + '/' + app.isoLanguage
}
