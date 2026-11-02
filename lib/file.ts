/**
 * The value of the OS's file system path separator symbol; \ or /
 * @type {string}
 */
export const pathSeparatorSymbol = path.sep

/**
 * [description]
 * @deprecated
 */
export function normalizePathArray() {
	throw new Error('Deprecated. Use `path.normalize` in UXP.')
}

/**
 * Checks whether the path starts with the OS separator symbol
 * @deprecated
 */
export function pathIsAbsolute() {
	throw new Error('Deprecated. Use `path.isAbsolute` in UXP.')
}

/**
 * [description]
 * @deprecated
 */
export function normalizePath() {
	throw new Error('Deprecated. Use `path.normalize` in UXP.')
}

/**
 * Joins path components into an OS-formatted file path string
 * @deprecated
 */
export function joinPath() {
	throw new Error('Deprecated. Use `path.join` in UXP.')
}

/**
 * Returns the extension of target file
 * @deprecated
 */
export function getExtension() {
	throw new Error('Deprecated. Use `path.extname` in UXP.')
}

/**
 * Returns the filename of target file without extension
 * @deprecated
 */
export function stripExtension() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}

/**
 * Takes a file path or a file object, and returns a file object
 * allows functions to be flexible in whether they take a path vs file
 * @deprecated
 */
export function getFileObject() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}

/**
 * Gets target file by path or file object, or null if doesn't exist
 * @deprecated
 */
export function getFile() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}

/**
 * Gets all files in target path that matches filter (or, all files if no filter)
 * @deprecated
 */
export function getFiles() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}

/**
 * Recursively scan folder for all files matching filter
 * @deprecated
 */
export function getFilesRecursive() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}

/**
 * Takes a folder path or a folder object, and returns a folder object
 * allows functions to be flexible in whether they take a path vs folder
 * @deprecated
 */
export function getFolderObject() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}

/**
 * Returns a folder, or null if it doesn't exist
 * @deprecated
 */
export function getFolder() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}

/**
 * Returns a folder, creating if it doesn't exist
 * @deprecated
 */
export function ensureFolderExists() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}

/**
 * Returns the contents of a specified file
 * @deprecated
 */
export function readFile() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}

/**
 * Writes data to a file, returns file
 * @deprecated
 */
export function writeFile() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}

/**
 * Prompts user to select files
 * @deprecated
 */
export function selectFiles() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}
