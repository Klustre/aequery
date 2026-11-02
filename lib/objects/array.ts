import { attr } from '../attr.ts'
import { extend } from '../main.ts'

let arrayExObj = {
	/**
	 * Groups an array by some condition as determined by each element
	 * @method
	 * @memberof arrayEx
	 * @param  {Function} callback Function to determine the key to group by
	 * @return {object}   An object whose keys are the result of callback and each
	 * value is an array of elements matching key
	 */
	groupBy: function (callback) {
		let obj = {}
		let len = this.length

		for (let i = 0; i < len; i++) {
			let key = callback(this[i], i, this) || 'undefined'
			let arr = obj[key] || []

			arr.push(this[i])

			obj[key.toString()] = arr
		}

		return obj
	},

	/**
	 * Inserts an element into arrayEx at specified index
	 * @method
	 * @memberof arrayEx
	 * @param  {any}    insert Element to insert
	 * @param  {number} index  Index to insert element at
	 */
	insertAt: function (insert, index) {
		this.splice(index, 0, insert)
	},

	/**
	 * Sets or gets an attribute value for all objects in the array. When getting a
	 * value, it only returns the valure from the first object.
	 * @method
	 * @memberof arrayEx
	 * @param {string} attributeName  The name of the attribute to get or set.
	 * @param  {Any}    [newValue]    The value to set. If not given, will only get
	 *                                the value of the first object.
	 * @return {Any}                  when getting, the value of the attribute.
	 *                                When setting, `undefined`.
	 * @see attr
	 */
	attr: function () {
		// Add this array object to the beginning of arguments
		;[].unshift.call(arguments, this)
		return attr.apply(this, arguments)
	},
}

/**
 * Array with some extensions that mimics modern JavaScript.
 * @class
 * @param  {Array} arr The array object to extend. If not supplied, an empty
 *                     arrayEx will be returned.
 */
export function arrayEx(arr = []) {
	if (arr._init) {
		return arr
	}

	/**
	 * Used to check if array is already extended.
	 * @memberof arrayEx
	 * @private
	 * @type {Boolean}
	 * @default
	 */
	arr._init = true

	/**
	 * @memberof arrayEx
	 * @private
	 * @type {Boolean}
	 * @default
	 */
	arr.isAeq = true

	extend(arr, arrayExObj)
	return arr
}
