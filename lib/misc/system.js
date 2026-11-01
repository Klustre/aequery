/**
 * `true` if system is MacOS
 * @type {Boolean}
 */
export const isMac = $.os.indexOf('Windows') === -1
export { isMac as MAC }

/**
 * `true` if system is Windows
 * @type {Boolean}
 */
export const isWindows = $.os.indexOf('Windows') !== -1
export { isWindows as isWin }
export { isWindows as WIN }

/**
 * Gets a string containing current OS, AE version and AE language
 * @method
 * @return {string} String containing current OS, AE version and AE language
 */
export function getSystemInfo() {
	return $.os + ' AE ' + app.version + '/' + app.isoLanguage
}
