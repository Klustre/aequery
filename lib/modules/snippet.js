import { getActiveComposition, getSelectedLayersOrAll } from '../dom'
import { createUndoGroup } from '../misc/undoGroup'
import { arrayEx } from '../objects/array'

/**
 * Gets the active comp and alerts the user if no comp is open. It then
 * creates an undo group and executes a callback function with the comp as
 * the first argument.
 * @function activeComp
 * @param  {String}   undoGroup Name of the undo group
 * @param  {function} callback  Function to execute that gets the active comp
 *                              as the first argument
 * @return {Boolean|Any}        `false` if the function is not executed
 *         because no comp was selected. Else the value the `callback`
 *         function returns is returned.
 */
export function activeComp(undoGroup, callback) {
	var comp = getCompWithAlert()
	if (comp === null) {
		return false
	}
	return createUndoGroup(undoGroup, callback, [comp])
}

/**
 * Gets the selected layers in the active comp and alerts the user if no comp
 * is open, or if no layer is selected. It then creates an undo group and
 * executes a callback function with the layers as the first argument, and the
 * comp as the second argument.
 * @param  {String}   undoGroup Name of the undo group
 * @param  {function} callback  Function to execute that gets the selected
 * layers as the first argument, and the comp as the second argument.
 * @return {Boolean|Any}        `false` if the function is not executed because
 * no comp or layer was selected. Else the value the `callback` function
 * returns is returned.
 */
export function selectedLayers(undoGroup, callback) {
	var comp = getCompWithAlert()
	if (comp === null) {
		return false
	}
	var layers = getSelectedLayersWithAlert(comp)
	if (layers === null) {
		return false
	}

	layers = arrayEx(layers)
	return createUndoGroup(undoGroup, callback, [layers, comp])
}

/**
 * Gets the selected layers or all layers if no layers are selected, in the
 * active comp. Alerts the user if no comp is open. It then creates an undo
 * group and executes a callback function with the layers as the first
 * argument, and the comp as the second argument.
 * @param  {String}   undoGroup Name of the undo group.
 * @param  {function} callback  Function to execute that gets the selected
 * layers in an ArrayEx as the first argument, and the comp as the second
 * argument.
 * @return {Boolean|Any}        `false` if the function is not executed because
 * no comp was open. Else the value the `callback` function is returned.
 */
export function selectedLayersOrAll(undoGroup, callback) {
	var comp = getCompWithAlert()
	if (comp === null) {
		return false
	}
	var layers = getSelectedLayersOrAll(comp)

	layers = arrayEx(layers)
	return createUndoGroup(undoGroup, callback, [layers, comp])
}

/**
 * Gets the selected properties in the active comp and alerts the user if no
 * comp is open, or if no property is selected. It then creates an undo group
 * and executes a callback function with the properties as the first argument,
 * and the comp as the second argument.
 * @param  {String}   undoGroup Name of the undo group
 * @param  {function} callback  Function to execute that gets the selected
 * properties in an ArrayEx as the first argument, and the comp as the second
 * argument.
 * @return {Boolean|Any}        `false` if the function is not executed.
 * because no comp or property was selected. Else the value the `callback`
 * function is returned.
 */
export function selectedProperties(undoGroup, callback) {
	var comp = getCompWithAlert()
	if (comp === null) {
		return false
	}
	var props = getSelectedPropertiesWithAlert(comp)
	if (props === null) {
		return false
	}

	props = arrayEx(props)
	return createUndoGroup(undoGroup, callback, [props, comp])
}

/**
 * Loops through the selected layers in the active comp. Alerts the user if no
 * comp is open, or no layer is selected. It then creates an undo group
 * and executes a callback function for each of the layers.
 * @param  {String}          undoGroup Name of the undo group.
 * @param  {forEachArrayCallback} callback  Function to execute for each layer.
 * @return {Boolean|ArrayEx} `false` if the function is not executed because
 *         no comp was open or no layer selected. Else the layers array is
 *         returned.
 */
export function forEachSelectedLayer(undoGroup, callback) {
	return selectedLayers(undoGroup, function (layers) {
		layers.forEach(callback)
		return layers
	})
}

/**
 * Loops through the selected layers or all layers if no layers are selected, in the
 * active comp. Alerts the user if no comp is open. It then creates an undo group
 * and executes a callback function for each of the layers.
 * @param  {String}          undoGroup Name of the undo group
 * @param  {forEachArrayCallback} callback  Function to execute for each layer.
 * @return {Boolean|ArrayEx}           `false` if the function is not executed
 *                                     because no comp was open. Else
 *                                     the layers array are returned.
 */
export function forEachSelectedLayerOrAll(undoGroup, callback) {
	return selectedLayersOrAll(undoGroup, function (layers) {
		layers.forEach(callback)
		return layers
	})
}

/**
 * Loops through the selected properties in the active comp. Alerts the user if no
 * comp is open, or no properties is selected. It then creates an undo group
 * and executes a callback function for each of the properties.
 * @param  {String}          undoGroup Name of the undo group
 * @param  {forEachArrayCallback} callback  Function to execute for each property.
 * @return {Boolean|ArrayEx}           `false` if the function is not executed
 *                                     because no comp was open or no layer
 *                                     selected. Else the property array
 *                                     is returned.
 */
export function forEachSelectedProperty(undoGroup, callback) {
	return selectedProperties(undoGroup, function (props) {
		props.forEach(callback)
		return props
	})
}

/**
 * Used for setting the default value in functions. Returns the first argument
 * is not undefined, else it returns `defaultVal`.
 *
 * If `defaultval` is a function, the function will run and its value returned.
 *
 * @method
 * @param  {Any} value      The value to check
 * @param  {Any} defaultVal The value to use if `value` is `undefined`
 * @return {Any}            `value` if it is not `undefined`, else `defaultVal`
 *
 * @example
 * function getCustomGreeting() {
 *     return prompt( 'Enter your greeting!', 'Hello World!' )
 * }
 * function say( greeting ) {
 *     a = setOrGetDefault( greeting, getCustomGreeting )
 *     alert( a )
 * }
 */
export function setOrGetDefault(value, defaultVal) {
	if (typeof value !== 'undefined') {
		return value
	}

	if (typeof defaultVal === 'function') {
		return defaultVal()
	}

	return defaultVal
}

function getCompWithAlert() {
	var comp = getActiveComposition()
	if (comp === null) {
		alert('No Comp selected')
	}
	return comp
}

function getSelectedLayersWithAlert(comp) {
	if (comp.selectedLayers.length === 0) {
		alert('No layers selected')
		return null
	}
	return comp.selectedLayers
}

function getSelectedPropertiesWithAlert(comp) {
	if (comp.selectedProperties.length === 0) {
		alert('No properties selected')
		return null
	}
	return comp.selectedProperties
}
