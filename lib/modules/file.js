import { filter, setDefault } from '../main'
import { isWin } from '../misc/system'
import { arrayEx } from '../objects/array'
import { isArray, isFile, isFolder, isNullOrUndefined } from '../types'

/**
 * The value of the OS's file system path separator symbol; \ or /
 * @type {string}
 */
export const pathSeparatorSymbol = $.os.indexOf('Windows') > -1 ? '\\' : '/'

// NormalizePathArray, pathIsAbsolute, normalizePath, joinPath adapted from path-browserify
// (https://github.com/substack/path-browserify/)
//
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
/**
 * [description]
 * @method
 * @param  {string[]} parts         Array of path components
 * @param  {boolean} allowAboveRoot [description]
 * @return {string[]}               [description]
 */
export function normalizePathArray(parts, allowAboveRoot) {
	// If the path tries to go above the root, `up` ends up > 0
	var up = 0
	for (var i = parts.length - 1; i >= 0; i--) {
		var last = parts[i]
		if (last === '.') {
			parts.splice(i, 1)
		} else if (last === '..') {
			parts.splice(i, 1)
			up++
		} else if (up) {
			parts.splice(i, 1)
			up--
		}
	}

	// If the path is allowed to go above the root, restore leading ..s
	if (allowAboveRoot) {
		for (; up--; up) {
			parts.unshift('..')
		}
	}

	return parts
}

/**
 * Checks whether the path starts with the OS separator symbol
 * @method
 * @param  {string} path File path
 * @return {boolean}     True if first character equals path separator symbol
 */
export function pathIsAbsolute(path) {
	return path.charAt(0) === pathSeparatorSymbol
}

/**
 * [description]
 * @method
 * @param  {string} path Raw joined file path
 * @return {string}      Normalized path
 */
export function normalizePath(path) {
	var isAbsolute = pathIsAbsolute(path),
		trailingSlash = path.substr(-1) === pathSeparatorSymbol

	// Normalize the path
	var splitPath = path.split(pathSeparatorSymbol)
	var filteredPath = filter(splitPath, function (p) {
		return !!p
	})
	path = normalizePathArray(filteredPath, !isAbsolute)
	path = path.join(pathSeparatorSymbol)

	if (!path && !isAbsolute) {
		path = '.'
	}
	if (path && trailingSlash) {
		path += pathSeparatorSymbol
	}

	return (isAbsolute ? pathSeparatorSymbol : '') + path
}

/**
 * Joins path components into an OS-formatted file path string
 * @method
 * @param  {...(String|File|Folder)} paths The path elements to join.
 * @return {string} File path string joined with OS's path separator
 */
export function joinPath() {
	var paths = Array.prototype.slice.call(arguments, 0)
	return normalizePath(
		filter(paths, function (p, index) {
			// Path is a File or Folder object.
			if (p && typeof p.fsName === 'string') {
				p = p.fsName
				paths[index] = p
			}
			if (typeof p !== 'string') {
				throw new TypeError('Arguments to path.join must be strings, Files or Folders')
			}

			return p
		}).join(pathSeparatorSymbol),
	)
}

/**
 * Returns the extension of target file
 * @method
 * @param  {File|string} filePath String path to a file, or file object
 * @return {string}               Extension of target file
 */
export function getExtension(filePath) {
	var filePathStr = isFile(filePath) ? filePath.name : filePath
	return filePathStr.substr(filePathStr.lastIndexOf('.') + 1, filePathStr.length)
}

/**
 * Returns the filename of target file without extension
 * @method
 * @param  {File|string} filePath String path to a file, or file object
 * @return {string}               Filename without extension
 */
export function stripExtension(filePath) {
	var filePathStr = isFile(filePath) ? filePath.name : filePath
	return filePathStr.substr(0, filePathStr.lastIndexOf('.'))
}

/**
 * Takes a file path or a file object, and returns a file object
 * allows functions to be flexible in whether they take a path vs file
 * @method
 * @param  {File|string} filePath String path to a file, or file object
 * @return {File}                 Resolved file object
 */
export function getFileObject(filePath) {
	return isFile(filePath) ? filePath : new File(filePath)
}

/**
 * Gets target file by path or file object, or null if doesn't exist
 * @method
 * @param  {File|string} filePath String path to a file, or file object
 * @return {File|null}            Target file, or null if doesn't exist
 */
export function getFile(filePath) {
	var file = getFileObject(filePath)

	if (!file.exists) {
		return null
	}

	return file
}

/**
 * Gets all files in target path that matches filter (or, all files if no filter)
 * @method
 * @param  {File|string} folderPath      Folder or path to get
 * @param  {string|function} [filter=""] Filter string or function
 * @return {arrayEx|null}                 Array of filtered files, or null if none
 */
export function getFiles(folderPath, filter) {
	filter = setDefault(filter, '')
	var folder = getFolder(folderPath),
		files

	files = folder.getFiles(filter)

	if (files === null || files.length === 0) {
		return null
	}

	return arrayEx(files)
}

/**
 * Recursively scan folder for all files matching filter
 * @method
 * @param {Folder|String}   folder      Folder or path to get files from
 * @param {string|function} [filter=""] Filter string or function
 * @returns {File[]}                    Array of found files
 */
export function getFilesRecursive(folder, filter) {
	var foundItems = arrayEx()

	var folderObject = getFolder(folder)
	if (isNullOrUndefined(folderObject)) {
		return foundItems
	}

	// Find all folders within folderObject and
	// recursively append anything it finds to foundItems
	var folderFiles = getFiles(folderObject)

	if (isNullOrUndefined(folderFiles)) {
		return foundItems
	}

	folderFiles
		.filter(function (item) {
			return isFolder(item)
		})
		.forEach(function (folderItem) {
			foundItems = foundItems.concat(getFilesRecursive(folderItem, filter))
		})

	var filesInFolder = getFiles(folderObject, filter)
	if (!isNullOrUndefined(filesInFolder)) {
		foundItems = foundItems.concat(filesInFolder)
	}

	return arrayEx(foundItems)
}

/**
 * Takes a folder path or a folder object, and returns a folder object
 * allows functions to be flexible in whether they take a path vs folder
 * @method
 * @param  {Folder|string} folderPath String path to a folder, or folder object
 * @return {Folder}                   Resolved folder object
 */
export function getFolderObject(folderPath) {
	return isFolder(folderPath) ? folderPath : new Folder(folderPath)
}

/**
 * Returns a folder, or null if it doesn't exist
 * @method
 * @param  {File|string} folderPath Folder path to get
 * @return {Folder|null} Target folder, or null if it doesn't exist
 */
export function getFolder(folderPath) {
	var folder = getFolderObject(folderPath)

	if (!folder.exists) {
		return null
	}

	return folder
}

/**
 * Returns a folder, creating if it doesn't exist
 * @method
 * @param  {File|string} folderPath Folder path to get or create
 * @return {Folder} Target folder
 */
export function ensureFolderExists(folderPath) {
	var folder = getFolderObject(folderPath)

	if (!folder.exists) folder.create()

	return folder
}

/**
 * Returns the contents of a specified file
 * @method
 * @param  {File|string} filePath    Path or file to read
 * @param  {string} [encoding=UTF-8] Encoding method
 * @return {string|null}             Contents of the file, or null if file doesn't exist
 */
export function readFile(filePath, encoding) {
	var file = getFileObject(filePath),
		contents

	encoding = setDefault(encoding, 'UTF-8')

	if (file.exists) {
		if (File.isEncodingAvailable(encoding)) {
			file.encoding = encoding
		}

		file.open()
		contents = file.read()
		file.close()
		return contents
	}
	return null
}

/**
 * Writes data to a file, returns file
 * @method
 * @param  {File|string} filePath              Path or file to write to
 * @param  {string}  contents                  Data to write to the file
 * @param  {object} [options]                  Options for writing file.
 * @param  {boolean} [options.overwrite=false] `true` if file should be overwritten if exists.
 * @param  {string} [options.encoding="UTF-8"] Encoding method.
 * @return {File|null}                         New file, or null if file was not written
 *                                             correctly or file exits and overwrite = false
 */
export function writeFile(filePath, contents, options) {
	var file = getFileObject(filePath)
	options = setDefault(options, {})

	if (file.exists && options.overwrite === false) {
		return null
	}

	if (!file.exists) {
		ensureFolderExists(file.path)
	}

	if (!isNullOrUndefined(options.encoding) && File.isEncodingAvailable(options.encoding)) {
		file.encoding = options.encoding
	}

	file.open('w')
	var success = file.write(contents)
	file.close()

	if (success) {
		return file
	}

	return null
}

/**
 * Prompts user to select files
 * @method
 * @param  {string[]} extensionList      Array of file extensions to accept
 * @param  {boolean} [multiSelect=false] `true` to allow multiple files
 * @return {file[]|null}                 ArrayEx of selected file(s), or null if canceled
 *
 * @example
 * var myFiles = selectFiles(["jsx", "theme", "someOtherExtension"], true);
 */
export function selectFiles(extensionList, multiSelect) {
	multiSelect = setDefault(multiSelect, false)
	var message = multiSelect ? 'Please select multiple files' : 'Please select file'

	if (!isArray(extensionList)) {
		extensionList = [extensionList]
	}

	var getFilterForFiles = function () {
		if (isWin) {
			return '*.' + extensionList.join(';*.')
		}

		var extensionListRe = '.(' + extensionList.join('|') + ')$'
		var re = new RegExp(extensionListRe, 'i')

		return function (file) {
			return file.name.match(re) || file.constructor.name === 'Folder'
		}
	}

	var files = File.openDialog(message, getFilterForFiles(), multiSelect)

	if (isNullOrUndefined(files)) {
		return null
	}

	if (!isArray(files)) {
		files = [files]
	}

	return arrayEx(files)
}
