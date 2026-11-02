const { app } = require('aftereffects')
const { platform } = require('os')

/*
 * `true` if system is MacOS
 * @type {Boolean}
 */
export const isMac = platform() === 'darwin'
export { isMac as MAC }

/**
 * `true` if system is Windows
 * @type {Boolean}
 */
export const isWindows = platform() !== 'darwin'
export { isWindows as isWin }
export { isWindows as WIN }

/**
 * Gets a string containing current OS, AE version and AE language
 * @method
 * @return {string} String containing current OS, AE version and AE language
 */
export function getSystemInfo() {
	return `${platform()} After Effects ${app.version}/${app.isoLanguage}`
}
