import { getCompositions, getPropertyChildren } from './dom.ts'
import { forEach } from './main.ts'
import {
	isArray,
	isComp,
	isFunction,
	isLayer,
	isPropertyGroup,
} from './types.ts'

const { app, CompItem, Layer, PropertyGroup } = require('aftereffects')

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
		var length = obj.numLayers,
			i = 1

		for (; i <= length; i++) {
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
		var properties = getPropertyChildren(obj, {})
		forEach(properties, callback)
	} else if (isComp(obj)) {
		forEachLayer(obj, function (layer) {
			var properties = getPropertyChildren(layer, {})
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
	var i, length, effects
	if (isLayer(obj)) {
		effects = obj.property('ADBE Effect Parade')
		length = effects.numProperties

		for (i = 1; i <= length; i++) {
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
	var project = app.project
	var items = project.items
	var length = items.length
	for (var i = 1; i <= length; i++) {
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
	var renderQueue = app.project.renderQueue
	var renderQueueItems = renderQueue.items
	var length = renderQueueItems.length
	for (var i = 1; i <= length; i++) {
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
		var length = item.outputModules.length
		for (var i = 1; i <= length; i++) {
			if (callback(item.outputModules[i], i, item) === false) {
				break
			}
		}
	})
}
export { forEachOutputModule as forEachOM }
