import { extend } from '../main.ts'

const { CompItem } = require('aftereffects')

/**
 * Converts a CompItem into an aeqComp object
 * @class
 * @param  {CompItem} comp CompItem to turn into aeqComp object
 * @return {aeqComp} aeqComp object of CompItem
 */
export function aeqComp(comp) {
	if (comp instanceof aeqComp) {
		return comp
	}
	if (this instanceof aeqComp) {
		this.comp = comp
	} else {
		return new aeqComp(comp)
	}
}

aeqComp.prototype = {
	isAeq: true,

	toString: function () {
		return '[object aeqComp]'
	},

	// Function for extending the prototype using objects
	extend: extend,

	/**
	 * Get the original object
	 * @method
	 * @instance
	 * @return {CompItem} Native Comp object
	 */
	get: function () {
		return this.comp
	},

	/**
	 * Runs a function on each layer in aeqComp object
	 * @method
	 * @instance
	 * @param  {Function} callback Function to run on each layer in aeqComp object
	 */
	forEachLayer: function (callback) {
		var length = this.comp.numLayers,
			i = 1

		for (; i <= length; i++) {
			callback(this.comp.layer(i), i, this)
		}
	},
}
