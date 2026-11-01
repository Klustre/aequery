import { getComp } from '../dom'
import { extend, forEach } from '../main'
import { allChildren, children, parents, relatedLayers } from '../modules/layer'
import { isComp, isLayer, isNumber, isString } from '../types'
import { aeqComp } from './comp'

/**
 * Converts a Layer into an aeqLayer object
 * @class
 * @param  {Layer} layer Layer to turn into aeqLayer object
 * @return {aeqLayer} Layer object of Layer
 */
export function aeqLayer(layer) {
	if (layer instanceof aeqLayer) {
		return layer
	}

	// Check if function called with "new" keyword
	if (this instanceof aeqLayer) {
		this.layer = layer
	} else {
		return new aeqLayer(layer)
	}
}

aeqLayer.prototype = {
	isAeq: true,

	toString: function () {
		return '[object aeqLayer]'
	},

	// Function for extending the prototype using objects
	extend: extend,

	/**
	 * Get the original object
	 * @method
	 * @instance
	 * @return {Layer} Native Layer object
	 */
	get: function () {
		return this.layer
	},

	/**
	 * Gets or sets layer parent
	 * @method
	 * @instance
	 * @param  {SelectorString|null} [selector] Selector for new parent, or
	 * null to remove parent
	 * @return {Layer|null} Parent layer, or null if none
	 */
	parent: function (selector) {
		if (arguments.length === 0) {
			return this.layer.parent
		}

		// Pass in null to remove the parent
		if (selector === null) {
			this.layer.parent = null
			return null
		}

		var layer = getLayer(this.layer, selector)

		if (layer === null) {
			return null
		}
		this.layer.parent = layer
		return layer
	},

	/**
	 * Copies current layer to comp
	 * @method
	 * @instance
	 * @param  {CompItem|aeqComp} comp Comp to copy layer to
	 * @return {aeqLayer}              Newly copied layer
	 */
	copyToComp: function (comp) {
		if (!isComp(comp)) {
			if (comp instanceof aeqComp) {
				comp = comp.comp
			} else if (isString(comp)) {
				comp = getComp(comp)
			}
		}
		this.layer.copyToComp(comp)
		return this
	},

	/**
	 * Removes this layer's parent
	 * @method
	 * @instance
	 * @return {aeqLayer} This layer
	 */
	removeParent: function () {
		this.layer.parent = null
		return this
	},

	/**
	 * Executes a callback function on each effect on this layer
	 * @method
	 * @instance
	 * @param  {Function} callback Function to run on each effect
	 * @return {aeqLayer}         This layer
	 */
	forEachEffect: function (callback) {
		var effects = this.layer.property('ADBE Effect Parade'),
			length = effects.numProperties,
			i = 1

		for (; i <= length; i++) {
			callback(effects.property(i), i, effects)
		}
		return this
	},

	/**
	 * Adds effect to layer by name or matchname
	 * @method
	 * @instance
	 * @param  {string} effectName Effect name or matchname to add to layer
	 */
	addEffect: function (effectName) {
		var effects = this.layer.property('ADBE Effect Parade')
		if (effects.canAddProperty(effectName)) {
			effects.addProperty(effectName)
		} else {
			throw new Error('Can not add effect "' + effectName + '" to this layer')
		}
	},

	/**
	 * Gets all layers that has the given layer as its parent.
	 * @method
	 * @instance
	 * @return {Layer[]} Children of this layer
	 */
	children: function () {
		return children(this.layer)
	},

	/**
	 * Gets all layers that has the given layer as its parent, and all layers
	 * that has those layers, and so on.
	 * @method
	 * @instance
	 * @return {Layer[]} Children and decendants of this layer
	 */
	allChildren: function () {
		return allChildren(this.layer)
	},

	/**
	 * This layer's parent chain
	 * @method
	 * @instance
	 * @return {Layer[]} Parents of this layer
	 */
	parents: function () {
		return parents(this.layer)
	},

	/**
	 * All [parents]{@link parents} and
	 * [all children]{@link allChildren} of the this layer.
	 * @method
	 * @instance
	 * @return {Layer[]} The layer's parents and children.
	 */
	relatedLayers: function () {
		return relatedLayers(this.layer)
	},
}

// Create methods that only returns the value for attributes that are read-
// only and can change over time;
forEach(
	['active', 'index', 'isNameSet', 'selectedProperties', 'time', 'containingComp', 'hasVideo'],
	function (attribute) {
		aeqLayer.prototype[attribute] = function () {
			return this.layer[attribute]
		}
	},
)

// Create methods for attributes that are basic read/write
forEach(
	[
		'comment',
		'enabled',
		'inPoint',
		'locked',
		'name',
		'outPoint',
		'shy',
		'solo',
		'startTime',
		'stretch',
	],
	function (attribute) {
		aeqLayer.prototype[attribute] = function (newValue) {
			if (arguments.length === 0) {
				return this.layer[attribute]
			}
			this.layer[attribute] = newValue

			// Return the aeqLayer object for chaining methods
			return this
		}
	},
)

// Create Methods that just call the layer object methods
forEach(
	['activeAtTime', 'applyPreset', 'duplicate', 'remove', 'moveToBeginning', 'moveToEnd'],
	function (method) {
		aeqLayer.prototype[method] = function (newValue) {
			this.layer[method](newValue)

			// Return the aeqLayer object for chaining methods
			return this
		}
	},
)

// Create methods that can take a Layer, aeqLayer, number or string as input
// and need to pass that to a method that takes a Layer object
forEach(['setParentWithJump', 'moveAfter', 'moveBefore'], function (method) {
	aeqLayer.prototype[method] = function (selector) {
		var layer = getLayer(this.layer, selector)

		if (layer === null) {
			return null
		}
		this.layer[method](layer)
		return layer
	}
})

// Used in aeqLayer.parent, setParentWithJump and move methods
var regexRelativeIndex = /^(\+|-)=/

/* The selector argument can be one of the following:
 * An aeqLayer object
 * A Layer object
 * An index for a layer in the comp
 * A string with a layer name
 * A string starting with "+=" or "-=" then a number to indicate an index
 * relative to the current layer
 */
function getLayer(baseLayer, selector) {
	var index, offset

	// Set the value
	if (selector instanceof aeqLayer) {
		return selector.layer
	}
	if (isLayer(selector)) {
		return selector
	}

	// Set parent to layer with index
	if (isNumber(selector)) {
		return baseLayer.containingComp.layer(selector)
	}

	// Set parent to layer with name or with a relative index
	if (isString(selector)) {
		// Check if string starts with "+=" or "-="
		if (regexRelativeIndex.test(selector)) {
			offset = getRelativeIndex(selector)
			if (offset) {
				// Set parent to layer with index relative to this layer
				index = baseLayer.index + offset

				// Return null if index is out of range
				if (index === 0 || index > baseLayer.containingComp.numLayers) {
					return null
				}
				return baseLayer.containingComp.layer(index)
			}
		}

		// Use the string as a name if it does not start with += or -= or if the
		// rest of the string is not a valid number
		return baseLayer.containingComp.layer(selector)
	}

	// If none of the above is true it should return null
	return null
}

function getRelativeIndex(str) {
	var offset = str.charAt(0) + str.substr(2)
	offset = parseInt(offset, 10)
	if (isNaN(offset)) {
		return false
	}
	return offset
}
