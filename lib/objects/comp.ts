import { extend } from '../utils.ts'

const { CompItem, Layer } = require('aftereffects')

/**
 * Converts a CompItem into an aeqComp object
 * @class
 * @param comp CompItem to turn into aeqComp object
 * @return aeqComp object of CompItem
 */
export function aeqComp(comp: typeof CompItem | typeof aeqComp) {
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
	extend,

	/**
	 * Get the original object
	 * @method
	 * @instance
	 * @return Native Comp object
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
	forEachLayer: function (
		callback: (
			layer: typeof Layer,
			index: number,
			layers: (typeof Layer)[],
		) => void,
	) {
		const length = this.comp.numLayers
		for (let i = 1; i <= length; i++) {
			callback(this.comp.layer(i), i, this)
		}
	},
}
