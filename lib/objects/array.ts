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

/**
 * Sets or gets an attribute value for all objects in an array. When getting a
 * value, it only returns the value from the first object.
 * @see arrayEx.attr
 * @method
 * @param array The array of objects to get or set attribute values of.
 * @param attributeName The name of the attribute to get or set.
 * @param newValue The value to set. If not given, will only get the value of the first object.
 * @return {Any|undefined} When getting, the value of the attribute. When setting, `undefined`.
 */
export function attr(array: any[], attributeName: string, newValue: any) {
	// Throw error if only array is given
	if (arguments.length === 1) {
		throw new Error('Only one argument given to attr, must be 2 or 3')

		// Get value of attributeName for first object in the array if only attributeName is given
	} else if (arguments.length === 2) {
		if (array[0] !== undefined && array[0] !== null) {
			return getAttr(array[0], attributeName)
		}
		return undefined

		// Set value of attributeName for all objects in array if newValue is given
	} else {
		for (let i = 0, il = array.length; i < il; i++) {
			setAttr(array[i], attributeName, newValue)
		}
		return array
	}
}

function getAttr(object, attributeName: string) {
	if (object[attributeName] instanceof Function) {
		return object[attributeName]()
	}
	return object[attributeName]
}

let attrObj = {
	setters: {
		'[object Property]': {
			value: 'setValue',
		},
	},
}

function setAttr(object, attributeName: string, newValue: any) {
	// Check if there is a special setter for this object and attributeName
	const attrSetters = attrObj.setters[object.toString()]
	if (attrSetters !== undefined) {
		const setter = attrSetters[attributeName]
		if (setter !== undefined) {
			attributeName = setter
		}
	}

	if (object[attributeName] instanceof Function) {
		object[attributeName](newValue)
	} else {
		object[attributeName] = newValue
	}
	return object
}
