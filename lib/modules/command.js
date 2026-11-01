import { setDefault } from '../main'
import { isWindows } from '../misc/system'
import { isFile, isObject } from '../types'

/**
 * Module for interacting with the command line / system
 * @namespace command
 * @type {Object}
 */
export const command = {
	call,
	openURL,
	revealFile,
	copyToClipboard,
}

/**
 * Call a command-line/system command.
 * @method
 * @param  {string|object} windows           Command to call if OS is windows,
 *                                           or an object with options.
 * @param  {string}        [windows.win]     Command to call if OS is windows.
 * @param  {string}        [windows.windows] Command to call if OS is windows.
 * @param  {string}        [windows.mac]     Argument to give the command.
 * @param  {string}        [windows.arg]     Command to call if OS is MacOS.
 * @param  {string}        [mac]             Command to call if OS is MacOS.
 * @param  {string}        [arg]             Argument to give the command.
 * @return {string}        The value returned from the command.
 *
 * @example
 * <caption>Open file in Finder/Explorer. ({@link revealFile})</caption>
 * call('Explorer /select,', 'open -R', '"' + file.fsName + '"' )
 * call({
 *     windows: 'Explorer /select,',
 *     mac: 'open -R',
 *     arg: '"' + file.fsName + '"'
 * })
 */
export function call(windows, mac, arg) {
	if (isObject(arguments[0])) {
		var args = arguments[0]
		windows = setDefault(args.win, args.windows)
		mac = setDefault(args.mac, args.osx)
		arg = args.arg
	}
	var command = mac
	if (isWindows) {
		command = windows
	}
	arg = arg === undefined ? '' : ' ' + arg
	return system.callSystem(command + arg)
}

/**
 * Opens the given URL in the default web browser.
 * @method
 * @param  {string} URL The URL to open.
 *
 * @example
 * <caption>Opens AEQuery bitbucket project.</caption>
 * openURL('https://bitbucket.org/motiondesign/aequery')
 */
export function openURL(URL) {
	try {
		if (URL.match(/^https?:\/\//) === null) {
			URL = 'http://' + URL
		}
		call({
			win: 'cmd /c "explorer',
			mac: 'open',
			arg: URL,
		})
	} catch (err) {
		alert('Error in openURL function\n' + err.toString())
	}
}

/**
 * Reveals the given file path or file object in Finder/Explorer.
 * @method
 * @param  {string|File} filePath The path to the file that should be
 *                                revealed, or a file object to reveal.
 * @return {string}      The value returned when calling the reveal command
 *                       in the command line. Mostly empty, holds error info
 *                       if not empty.
 * @example
 * <caption>Reveals the rurnning script in Finder/Explorer</caption>
 * revealFile( $.fileName )
 */
export function revealFile(filePath) {
	if (isFile(filePath)) {
		filePath = filePath.fsName
	}
	return call('Explorer /select,', 'open -R', '"' + filePath + '"')
}

/**
 * Copies a string to the users clipboard.
 * @method
 * @param  {string} text The string to copy.
 *
 * @example
 * copyToClipboard( 'Hello World!' )
 */
export function copyToClipboard(text) {
	call(
		'cmd.exe /c cmd.exe /c "echo ' + text + ' | clip"', // Windows
		'echo "' + text + '" | pbcopy', // MacOS
	)
}

// Function aliases
export const callSystem = call
