import { assertIsNotNull } from './assert.ts'
import { forEachLayer } from './forEach.ts'
import { forEach, setDefault } from './main.ts'
import { version } from './modules/app.ts'
import { getFolder } from './modules/project.ts'
import { arrayEx } from './objects/array.ts'
import { aeqKey } from './objects/key.ts'
import {
	isArray,
	isComp,
	isFolderItem,
	isLayer,
	isPropertyGroup,
} from './types.ts'

const {
	app,
	CompItem,
	FolderItem,
	Layer,
	Item,
	Collection,
	MarkerPropertyGroup,
	Property,
	PropertyGroup,
	PropertyType,
} = require('aftereffects')

/**
 * Gets all the item in a folder or project.
 * @method
 * @param folder The Folder to get items from.
 * @param deep When `true`, gets items from subfolders as well.
 * @return {arrayEx} Array of Item objects
 */
export function getItems(folder?: typeof FolderItem, deep = true) {
	// If no arguments are given, just return all items in project.
	if (folder === undefined) {
		return normalizeCollection(app.project.items)
	}

	folder = getFolder(folder)
	if (folder === null) {
		return arrayEx()
	}

	if (deep) {
		return getItemsDeep(folder)
	}

	return normalizeCollection(folder.items)
}

/**
 * Returns an {@link arrayEx} with all items in a folder, and items in
 * subfolders.
 * @method
 * @param folder The folder to flatten.
 * @param returnArrayEx Included so we can skip the converting to arrayEx when recursing. It is not meant to be used outside of this function.
 * @return ArrayEx with Item objects.
 */
export function getItemsDeep(folder: typeof FolderItem, returnArrayEx = true) {
	let items = []
	let len = folder.items.length

	for (let i = 1; i <= len; i++) {
		const item = folder.items[i]
		if (isFolderItem(item)) {
			// Add all items in subfolder to the `items` array.
			items.push.apply(items, getItemsDeep(item, false))
		}
		items.push(item)
	}

	// Skip converting to arrayEx when function is called by it self.
	if (returnArrayEx === false) {
		return items
	}
	return arrayEx(items)
}

/**
 * Gets the all layers where the given Item object is used as a source.
 * @method
 * @param item The item to find in comps
 * @return {arrayEx}  Array of Layer objects
 */
export function getItemInComps(item: typeof Item) {
	let layers: (typeof Layer)[] = []
	forEach(item.usedIn, function (comp) {
		forEachLayer(comp, function (layer) {
			if (layer.source === item) {
				layers.push(layer)
			}
		})
	})
	return arrayEx(layers)
}

/**
 * Gets all the CompItems in the project. Or all CompItems in the given folder.
 * @method
 * @param folder The folder to get comps from.
 * @param deep Go through subfolders looking for comps.
 * @return {arrayEx} Array of CompItems
 */
export function getCompositions(folder?: typeof FolderItem, deep = true) {
	const items = getItems(folder, deep)
	return items.filter(isComp)
}
export { getCompositions as getComps }

/**
 * Gets the active CompItem.
 * This gets `app.project.activeItem` and verifies that it is a comp. If it
 * not, it returns null.
 * @method
 * @return {CompItem|null} The active comp, or null if there is none.
 */
export function getActiveComposition() {
	const activeItem = app.project.activeItem
	if (isComp(activeItem)) {
		return activeItem
	}
	return null
}
export { getActiveComposition as activeComp }
export { getActiveComposition as getActiveComp }
export { getActiveComposition as activeComposition }

/**
 * Gets the CompItem with the matching name, or `null` if none is found.
 * @method
 * @param name The name of the comp to found
 * @return {CompItem|null} The comp with the matching name, or null if none is found
 */
export function getComposition(name: string) {
	const length = app.project.items.length
	for (let i = 1; i <= length; i++) {
		const item = app.project.item(i)
		if (item.name === name && isComp(item)) {
			return item
		}
	}
	// If the function have not returned by now, there is no comp with that name
	return null
}
export { getComposition as getComp }

/**
 * Gets all layers layers in a comp or an array of comps. This differs from
 * `comp.layers` in that this returns an actual array. Instead of a colletion
 * with a start index of 1.
 * @method
 * @param comps CompItem(s) to get layers from.
 * @return {arrayEx} Layer objects in the comp(s)
 */
export function getLayers(comps: typeof CompItem | (typeof CompItem)[]) {
	assertIsNotNull(comps, 'comps is null')

	let arr: typeof CompItem | (typeof CompItem)[] = []

	if (isComp(comps)) {
		comps = [comps]
	}

	for (let i = 0; i < comps.length; i++) {
		const comp = comps[i]
		arr = arr.concat(normalizeCollection(comp.layers))
	}

	return arrayEx(arr)
}

/**
 * Gets selected layers from a given comp or from the active comp if no comp is given.
 * If there is no active comp, an empty array is returned.
 * @method
 * @param comp The comp to get selected layers from.
 * @return {arrayEx} Array of Layer objects.
 */
export function getSelectedLayers(comp?: typeof CompItem) {
	if (!isComp(comp)) {
		comp = getActiveComposition()
	}
	if (comp) {
		return arrayEx(comp.selectedLayers)
	}
	return arrayEx()
}

/**
 * Gets selected layers, or all layers if none is selected, from a given comp
 * or from the active comp if no comp is given. If there is no active comp,
 * an empty array is returned.
 * @method
 * @param comp Comp to get layers from
 * @return {arrayEx} Array of Layer objects
 */
export function getSelectedLayersOrAll(comp?: typeof CompItem) {
	if (!isComp(comp)) {
		comp = getActiveComposition()
		if (comp === null) {
			return arrayEx()
		}
	}

	const layers = getSelectedLayers(comp)

	if (layers.length === 0) {
		return getLayers(comp)
	}

	return layers
}
export { getSelectedLayersOrAll as getSelectedOrAllLayers }

/**
 * Gets the selected properties on a layer or in a comp. Uses the active comp
 * if no argument is given. If there is no active comp, an empty array is
 * returned.
 * @method
 * @param obj The object to get selected properties from. Defaults to the active comp.
 * @return {arrayEx} Array of Property objects
 */
export function getSelectedProperties(obj?: typeof CompItem | typeof Layer) {
	if (!obj) {
		obj = getActiveComposition()
	}
	if (obj) {
		return arrayEx(obj.selectedProperties)
	}
	return arrayEx()
}
export { getSelectedProperties as getSelectedProps }

/**
 * Gets all Property objects of all Layer objects in an array.
 * @method
 * @param layers Layer Objects to get properties from.
 * @param  {Object} [options] Options for the function.
 * @param  {boolean} [options.separate=true] set to true to separate properties
 * (e.g separates Position into xPosition and yPosition).
 * @param  {boolean} [options.groups=false] set to true to include property groups.
 * @param  {boolean} [options.props=true] set to true to include properties.
 * @return {arrayEx} Array of Property objects
 */
export function getProperties(layers: (typeof Layer)[], options) {
	assertIsNotNull(layers, 'argument layers is null')

	let arr = []

	for (let l = 0; l < layers.length; l++) {
		const layer = layers[l]
		arr = arr.concat(getPropertyChildren(layer, options))
	}

	return arrayEx(arr)
}

/**
 * Gets all children of the given layer or propertyGroup. This is a recursive
 * function, so it also gets grandchildren an so on.
 * @method
 * @param propertyParent Object to get properties from
 * @param  {Object} [options] Options for the function.
 * @param  {boolean} [options.separate=true] set to true to separate properties
 * (e.g separates Position into xPosition and yPosition).
 * @param  {boolean} [options.groups=false] set to true to include property groups.
 * @param  {boolean} [options.props=true] set to true to include properties.
 * @return {Array}            Array of Property objects
 */
export function getPropertyChildren(
	propertyParent: typeof Layer | typeof PropertyGroup,
	options,
) {
	options = setDefault(options, { separate: false })
	const len = propertyParent.numProperties
	let arr = []

	for (let i = 1; i <= len; i++) {
		let property = propertyParent.property(i)

		switch (property.propertyType) {
			case PropertyType.PROPERTY:
				if (options.separate) {
					property = normalizeProperty(propertyParent, property)
				}
				if (options.props !== false) {
					// On by defualt
					arr.push(property)
				}
				break

			case PropertyType.INDEXED_GROUP:
			case PropertyType.NAMED_GROUP:
				if (options.groups === true) {
					// Off by default
					arr.push(property)
				}
				arr = arr.concat(getPropertyChildren(property, options))
				break

			default:
				break
		}
	}

	return arr
}

/**
 * Gets the propertyGroups inside the effects group from all layers given.
 * @method
 * @param layers The Layer(s) to get effects from.
 * @return {arrayEx} Array of PropertyGroup objects
 */
export function getEffects(layers: typeof Layer | (typeof Layer)[]) {
	assertIsNotNull(layers, 'layers is null')

	if (isLayer(layers)) {
		layers = [layers]
	}

	const len = layers.length
	let effectslen
	let arr = []

	for (let l = 0; l < len; l++) {
		const effects = layers[l].property('ADBE Effect Parade')
		if (effects === null) {
			continue
		}

		effectslen = effects.numProperties
		for (let e = 1; e <= effectslen; e++) {
			arr.push(effects.property(e))
		}
	}
	return arrayEx(arr)
}

/**
 * Gets the Marker property group from the given layer or comp. If no object
 * is given, the active comp is used. If there is no active comp, `null` is
 * returned.
 * Note: Marker groups for comps is only available for After Effects version
 * 14.0 and later. If a comp is used in a earlier version. This function will
 * return `null`
 * @method
 * @param obj The object to get the marker group from.
 * @return {MarkerPropertyGroup|null} Object marker group, or null if n/a
 */
export function getMarkerGroup(obj?: typeof Layer | typeof CompItem) {
	if (!obj) {
		obj = getActiveComposition()
	}

	if (isLayer(obj)) {
		return obj.property('ADBE Marker')
	}

	if (isComp(obj) && version >= 14.0) {
		return obj.markerProperty
	}

	return null
}

/**
 * Gets all keys on the given property or array of properties. Returns an
 * aeqKeys object which can be used to see all attributes of the key.
 * @method
 * @param property The Property or Properties to get keys from.
 * @return {arrayEx} Array of aeqKey objects.
 */
export function getKeys(property: typeof Property | (typeof Property)[]) {
	let arr = []

	if (isArray(property)) {
		for (let i = 0, len = property.length; i < len; i++) {
			arr = arr.concat(getKeys(property[i]))
		}
		return arrayEx(arr)
	}

	for (let i = 1, len = property.numKeys; i <= len; i++) {
		arr.push(aeqKey(property, i))
	}

	return arrayEx(arr)
}

// TODO: Document function and add types
export function getChildren(obj) {
	if (isComp(obj)) {
		return normalizeCollection(obj.layers)
	}
	if (isLayer(obj) || isPropertyGroup(obj)) {
		return getPropertyChildren(obj, {})
	}
	if (isArray(obj)) {
		let ret = arrayEx()
		forEach(obj, function (item) {
			ret.push.apply(ret, getChildren(item))
		})
		return ret
	}
}

/**
 * Collection arrays have indexes in the range `1-Collection.length`, which is
 * usually not ideal when programming. This function takes a Collection object
 * and converts it to a normal array.
 * @method
 * @param collection The Collection to convert
 * @return {arrayEx} Normalized collection
 */
export function normalizeCollection(collection: typeof Collection) {
	// Because collection objects have a range [1...length], which is not ideal.
	// This returns an array with all objects in the collection.
	const len = collection.length
	const ret = []

	// Loops over the collection because `Array.slice` can't access
	// the Proxy's target array via the internal `get` method
	for (let i = 1; i <= len; i++) {
		ret.push(collection[i])
	}

	return arrayEx(ret)
}

/**
 * Converts frame count to time.
 * @method
 * @param frames Frame count to convert
 * @param frameRate FPS to convert with
 * @return Frame count in time
 */
export function framesToTime(frames: number, frameRate: number) {
	return frames / frameRate
}

/**
 * Converts time to frame count.
 * @method
 * @param time Time to convert
 * @param frameRate FPS to convert with
 * @return Time in frames
 */
export function timeToFrames(time: number, frameRate: number) {
	return time * frameRate
}

function normalizeProperty(propertyParent, property) {
	switch (property.name) {
		case 'X Position':
		case 'Y Position':
		case 'Z Position':
			property = propertyParent.property('Position')
			property.dimensionsSeparated = true
			return property.propertyGroup().property(property.name)

		default:
			return property
	}
}
