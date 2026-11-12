import { getCompositions, getPropertyChildren } from './dom.ts'
import { arrayEx } from './objects/array.ts'
import {
	isArray,
	isComp,
	isFunction,
	isLayer,
	isPropertyGroup,
} from './types.ts'

const { app, CompItem, Layer, PropertyGroup } = require('aftereffects')

/**
 * Is executed for each element in an array
 * @callback forEachArrayCallback
 * @param {Any}     element The current element in the array
 * @param {Integer} index   The index of the current element in the array
 * @param {Array}   array   The array being looped through
 */

/**
 * Is executed for key-value pair in an object
 * @callback forEachObjectCallback
 * @param {Any}     element The current key in the object
 * @param {Integer} index   The value of the current key
 * @param {Array}   array   The object being looped through
 */

/**
 * Loops through arrays and objects
 * @function
 * @param  {Array|Object} obj       The array or object to loop through.
 * @param  {forEachArrayCallback|forEachObjectCallback} callback
 *         Function to execute for each element in the object or array
 * @param  {Number} [fromIndex]     Index to start iterating from
 * @return {Array|Object}           The value of `obj`
 */
export function forEach(obj, callback, fromIndex) {
	if (obj && Object.prototype.toString.call(obj) === '[object Array]') {
		const length = obj.length
		let i = fromIndex === undefined ? 0 : fromIndex
		for (; i < length; i++) {
			if (callback(obj[i], i, obj) === false) {
				break
			}
		}
	} else {
		for (const i in obj) {
			if (obj.hasOwnProperty(i)) {
				if (callback(i, obj[i], obj) === false) {
					break
				}
			}
		}
	}
	return obj
}

/**
 * Loops through the layers of a comp, array of comps, or all layers in the
 * project, and executes a function for each one.
 * @method
 * @param  {CompItem|CompItem[]|forEachArrayCallback}   [obj]
 *         A `CompItem` or array of `compItem`s to get layers from.
 *         If this is function, the function will loop through all layers in
 *         the project.
 * @param  {forEachArrayCallback}
 *         callback The function to execute for each layer
 */
export function forEachLayer(obj, callback) {
	if (isComp(obj)) {
		const length = obj.numLayers
		for (let i = 1; i <= length; i++) {
			if (callback(obj.layer(i), i, obj) === false) {
				break
			}
		}
	} else if (isArray(obj)) {
		forEach(obj, function (obj) {
			forEachLayer(obj, callback)
		})
	} else if (isFunction(obj)) {
		callback = obj
		forEachComp(function (comp) {
			forEachLayer(comp, callback)
		})
	}
}

/**
 * Loops through the properties of a Comp, Layer, PropertyGroup, or an array
 * of any of them, and executes a function for each one.
 * @method
 * @param  {CompItem|Layer|PropertyGroup|Array|forEachArrayCallback}   [obj]
 *         The object or array of objects to get properties from.
 *         If this is function, the function will loop through all properties
 *         in the project.
 * @param  {forEachArrayCallback} callback
 *         The function to execute for each property
 */
export function forEachProperty(obj, callback) {
	if (isLayer(obj) || isPropertyGroup(obj)) {
		const properties = getPropertyChildren(obj, {})
		forEach(properties, callback)
	} else if (isComp(obj)) {
		forEachLayer(obj, function (layer) {
			const properties = getPropertyChildren(layer, {})
			forEach(properties, callback)
		})
	} else if (isArray(obj)) {
		forEach(obj, function (obj) {
			forEachProperty(obj, callback)
		})
	} else if (isFunction(obj)) {
		callback = obj
		forEachLayer(function (layer) {
			forEachProperty(layer, callback)
		})
	}
}
export { forEachProperty as forEachProp }

/**
 * Loops through the effects in a Comp, or on a Layer, and executes a function
 * for each one.
 * @method
 * @param  {CompItem|Layer|Array|forEachArrayCallback}   [obj]
 *         The object or array of objects to get effects from.
 *         If this is function, the function will loop through all properties
 *         in the project.
 * @param  {forEachArrayCallback} callback
 *         The function to execute for each effect
 */
export function forEachEffect(obj, callback) {
	if (isLayer(obj)) {
		const effects = obj.property('ADBE Effect Parade')
		const length = effects.numProperties
		for (let i = 1; i <= length; i++) {
			if (callback(effects.property(i), i, effects) === false) {
				break
			}
		}
	} else if (isComp(obj)) {
		forEachLayer(obj, function (layer) {
			forEachEffect(layer, callback)
		})
	} else if (isArray(obj)) {
		forEach(obj, function (obj) {
			forEachEffect(obj, callback)
		})
	} else if (isFunction(obj)) {
		callback = obj
		forEachLayer(function (layer) {
			forEachEffect(layer, callback)
		})
	}
}

/**
 * Loops through the comps in a project and executes a function for each one.
 * @method
 * @param  {forEachArrayCallback} callback
 *         The function to execute for each comp.
 */
export function forEachComp(callback) {
	forEach(getCompositions(), callback)
}
export { forEachComp as forEachComposition }

/**
 * Loops through the Project items in a project and executes a function
 * for each one.
 * @method
 * @param  {forEachArrayCallback} callback
 *         The function to execute for each item.
 */
export function forEachItem(callback) {
	const project = app.project
	const items = project.items
	const length = items.length
	for (let i = 1; i <= length; i++) {
		if (callback(items[i], i, project) === false) {
			break
		}
	}
}

/**
 * Loops through the items in the renderqueue and executes a function
 * for each one.
 * @method
 * @param  {forEachArrayCallback} callback
 *         The function to execute for each renderQueue Item.
 */
export function forEachRenderQueueItem(callback) {
	const renderQueue = app.project.renderQueue
	const renderQueueItems = renderQueue.items
	const length = renderQueueItems.length
	for (let i = 1; i <= length; i++) {
		if (callback(renderQueueItems[i], i, renderQueue) === false) {
			break
		}
	}
}
export { forEachRenderQueueItem as forEachRQItem }

/**
 * Loops through the output modules in the renderqueue and executes a function
 * for each one.
 * @method
 * @param  {forEachArrayCallback} callback
 *         The function to execute for each Output Module.
 */
export function forEachOutputModule(callback) {
	forEachRenderQueueItem(function (item) {
		const length = item.outputModules.length
		for (let i = 1; i <= length; i++) {
			if (callback(item.outputModules[i], i, item) === false) {
				break
			}
		}
	})
}
export { forEachOutputModule as forEachOM }

/**
 * Loops through arrays and objects and returns a filtered array
 * @function
 * @param  {Array|Object}   obj       The Array/object to loop through
 * @param  {forEachArrayCallback|forEachObjectCallback} callback  The function
 *         to execute for each element in the object. Should return a truthy
 *         value if the element should be included in the returned array.
 * @return {Array} The filtered array
 */
export function filter(obj, callback) {
	let filteredArr = []

	if (obj && Object.prototype.toString.call(obj) === '[object Array]') {
		const length = obj.length
		for (let i = 0; i < length; i++) {
			if (callback(obj[i], i, obj)) {
				filteredArr.push(obj[i])
			}
		}
	} else {
		for (const i in obj) {
			if (obj.hasOwnProperty(i)) {
				if (callback(i, obj[i], obj)) {
					filteredArr.push(obj[i])
				}
			}
		}
	}
	return arrayEx(filteredArr)
}
