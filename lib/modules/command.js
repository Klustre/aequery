/**
 * Call a command-line/system command.
 * @deprecated
 */
export function call() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}
export { call as callSystem }

/**
 * Opens the given URL in the default web browser.
 * @deprecated
 */
export function openURL() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}

/**
 * Reveals the given file path or file object in Finder/Explorer.
 * @deprecated
 */
export function revealFile() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}

/**
 * Copies a string to the users clipboard.
 * @deprecated
 */
export function copyToClipboard() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}
