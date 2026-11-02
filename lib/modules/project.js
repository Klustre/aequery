import { getCompositions, getItems } from '../dom'
import { filter, forEach, setDefault } from '../main'
import { arrayEx } from '../objects/array'
import {
	isArray,
	isComp,
	isEmpty,
	isFolderItem,
	isFootageItem,
	isNullOrUndefined,
	isString,
} from '../types'
import { getAEP } from './app'
import { getQueuedComps } from './renderqueue'

const { app, FolderItem, FootageItem, CompItem, Item, ImportOptions } = require('aftereffects')

/**
 * Gets all footage items in project
 * @method
 * @param  {FolderItem|string} [parentFolder=app.project.root] Folder to search
 * in by name or item, or root if undefined
 * @return {FootageItem[]} ArrayEx of project footage items
 */
export function getFootage(parentFolder) {
	var items = getItems(parentFolder)

	return items.filter(isFootageItem)
}

/**
 * Gets all folders within target folder, or root
 * @method
 * @param  {FolderItem|string} [parentFolder=app.project.root] Folder to search
 * in by name or item, or root if undefined
 * @return {FolderItem[]}      ArrayEx of folder items
 */
export function getFolders(parentFolder) {
	var folders = getItems(parentFolder)

	return folders.filter(isFolderItem)
}

/**
 * Find folder by name in target folder.
 * @method
 * @param  {string} name       Folder name to find.
 * @param  {FolderItem|string} [parentFolder=app.project.root]
 * Folder to search in by name or item, or root if undefined.
 * @return {FolderItem|null}   FolderItem with the name. Or `null` if not found.
 */
export function findFolder(name, parentFolder) {
	var folders = getFolders(parentFolder)

	var folder = filter(folders, function (folder) {
		return folder.name === name
	})
	if (folder.length) {
		return folder[0]
	}
	return null
}

/**
 * Gets folder item, or null if can't find
 * @method
 * @param  {FolderItem|string} folder Folder to get by name or item, or root if undefined
 * @param  {FolderItem|string} [parentFolder=app.project.root]
 * Parent folder to search in by name or item, or root if undefined
 * @return {FolderItem|null}   Target folder item, or null
 */
export function getFolder(folder, parentFolder) {
	if (isFolderItem(folder)) {
		return folder
	}

	if (isString(folder)) {
		return findFolder(folder, parentFolder)
	}

	return null
}

/**
 * Gets all folder items that are selected
 * @method
 * @return {FolderItem[]} ArrayEx of all selected folder items
 */
export function getSelectedFolders() {
	return filter(app.project.selection, isFolderItem)
}

/**
 * Gets all comp items that are selected
 * @method
 * @return {CompItem[]} ArrayEx of all selected comp items
 */
export function getSelectedComps() {
	return filter(app.project.selection, isComp)
}

/**
 * Gets selected comps, or all comps if none is selected.
 * @method
 * @return {arrayEx} Array of Comp objects
 */
export function getSelectedCompsOrAll() {
	if (isEmpty(app.project.selection)) {
		return getCompositions()
	}

	return getSelectedComps()
}
export { getSelectedCompsOrAll as getSelectedOrAllComps }

/**
 * Gets all footage items that are selected
 * @method
 * @return {Item[]} ArrayEx of all selected footage items
 */
export function getSelectedFootage() {
	return filter(app.project.selection, isFootageItem)
}

/**
 * Gets folder item, or creates it if can't find
 * @method
 * @param  {FolderItem|string} folder Folder to get by name or item, or root if undefined
 * @param  {FolderItem|string} [parentFolder=app.project.root]
 * Parent folder to search in by name or item, or root if undefined
 * @return {FolderItem}        Target folder item
 */
export function getOrCreateFolder(folder, parentFolder) {
	if (isNullOrUndefined(parentFolder)) {
		parentFolder = app.project.rootFolder
	} else {
		parentFolder = getOrCreateFolder(parentFolder)
	}

	var foundFolder = getFolder(folder, parentFolder)

	if (isNullOrUndefined(foundFolder)) {
		return parentFolder.items.addFolder(folder)
	}

	return foundFolder
}

/**
 * Gets folder item, or root if undefined
 * @method
 * @param  {FolderItem|string} [folder=app.project.root]
 * Folder to get by name or item, or root if undefined
 * @return {FolderItem}        Target folder item
 */
export function getFolderOrRoot(folder) {
	folder = getFolder(folder)

	if (isNullOrUndefined(folder)) {
		return app.project.rootFolder
	}

	return folder
}

/**
 * Saves current AEP to target path, or prompts user if no path
 * @method
 * @param  {string} [path] Path to save AEP to
 * @return {File}          File object of AEP
 */
export function save(path) {
	throw new Error('TODO: Migrate to UXP')
	// if (!path) {
	// 	return app.project.save()
	// }

	// var file = getFileObject(path)

	// if (file.exists) {
	// 	if (!confirm('File exists! Overwrite?')) {
	// 		return null
	// 	}
	// }

	// return app.project.save(file)
}

/**
 * Saves current AEP to current path
 * @method
 * @return {File} File object of AEP
 */
export function quickSave() {
	var file = getAEP()
	return app.project.save(file)
}

/**
 * Imports a file into After Effects.
 * @method
 * @param  {string|File} file    The file to import.
 * @param  {string|FolderItem} [folder=app.project]  The folder where the
 * imported item will be placed.
 * @param  {object} [options] options for importOptions.
 * @param  {boolean} [options.sequence=false] `true` if file should import as sequence.
 * @return {Item}    The imported item
 */
export function importFile(file, folder, options) {
	throw new Error('TODO: Migrate to UXP')
	// var proj = app.project,
	// 	newItem

	// var newFile = getFile(file)

	// if (!isFile(newFile)) {
	// 	throw new Error(file + ' is not a valid file!')
	// }

	// if (isNullOrUndefined(folder)) {
	// 	folder = app.project.rootFolder
	// } else {
	// 	folder = getOrCreateFolder(folder)
	// }

	// options = setDefault(options, {})

	// var iO = new ImportOptions(newFile)

	// if (options.sequence === true) {
	// 	iO.sequence = true
	// }

	// try {
	// 	newItem = proj.importFile(iO)
	// } catch (e) {
	// 	throw new Error("Can't import file " + newFile.name + '\n' + String(e))
	// }

	// if (newItem.duration * newItem.frameRate === 1) {
	// 	newItem.replace(file)
	// }

	// newItem.parentFolder = folder
	// newItem.selected = false

	// return newItem
}

/**
 * Like {@link importFile} but without the extra.
 * @method
 * @param  {File} file    File object to import
 * @param  {object} [options] options for importOptions
 * @param  {boolean} [options.sequence=false] `true` if file should import as sequence
 * @return {Item}    The imported item
 */
export function simpleImportFile(file, options) {
	var iO = new ImportOptions(file)

	options = setDefault(options, {})
	if (options.sequence === true) {
		iO.sequence = true
	}

	var newItem
	try {
		newItem = app.project.importFile(iO)
	} catch (e) {
		throw new Error("Can't import file " + file.name + '\n' + String(e))
	}

	return newItem
}

/**
 * Imports a sequence by file object or path
 * @method
 * @param  {File|string} file    File or path of sequence to import
 * @param  {FolderItem} [folder] Folder to import items to
 * @return {Item}                Imported sequence
 */
export function importSequence(file, folder) {
	return importFile(file, folder, { sequence: true })
}

/**
 * Imports array of files or paths to target folder
 * @method
 * @param  {File[]|string[]} fileArray        Array of files or paths to import
 * @param  {FolderItem} [folder]              Folder to import items to
 * @param  {object} [options]                 options for importOptions.
 * @param  {boolean} [options.sequence=false] `true` if file should import as sequence.
 * @return {Item[]}                          ArrayEx of imported items
 */
export function importFiles(fileArray, folder, options) {
	var importedItems = arrayEx()

	forEach(fileArray, function (file) {
		var item = importFile(file, folder, options)
		importedItems.push(item)
	})

	return importedItems
}

/**
 * Moves item(s) to specified folder
 * @method
 * @param  {Item|Item[]} items Item or array of items
 * @param  {FolderItem} folder Folder to move item(s) to
 */
export function moveToFolder(items, folder) {
	folder = getFolder(folder)

	if (!isArray(items)) {
		items = [items]
	}

	forEach(items, function (item) {
		item.parentFolder = folder
		item.selected = false
	})
}

/**
 * Reduces current project to only comps that are queued
 * @method
 * @return {CompItem[]|null} Array of queued comps, or null
 */
export function reduceToQueuedComps() {
	var queuedComps = getQueuedComps()

	if (queuedComps.length === 0) {
		return null
	}

	app.project.reduceProject(queuedComps)

	return queuedComps
}
