import * as aeqApp from './modules/app.ts'
import { arrayEx } from './objects/array.ts'
import { aeqComp } from './objects/comp.ts'
import { aeqLayer } from './objects/layer.ts'
import { aeqProperty } from './objects/property.ts'
import { select, SelectorString } from './select.ts'
import {
	isAeq,
	isApp,
	isArray,
	isComp,
	isFunction,
	isLayer,
	isNullOrUndefined,
	isPlainObject,
	isProperty,
	isString,
} from './types.ts'

const {
	FolderItem,
	Layer,
	CompItem,
	PropertyGroup,
	Property,
} = require('aftereffects')

/**
 * Gets objects by looking at a string and finding objects in After
 * Effects matching the description. The context is used to
 * determine a starting point for where the function starts looking
 * for elements.
 * If an `Array`, `CompItem`, `Layer`, or `Property` is given, the object will be
 * converted to the corresponding aequery object: `ArrayEx`, `aeqComp`,
 * `aeqLayer`, `aeqProperty`.
 * @variation 1
 * @method
 * @param selector A string containing a selector expression, or an object to be converted to aeq type object.
 * @param context The object to start looking from
 * @return {arrayEx|aeqComp|aeqLayer|aeqProperty} The found After Effects objects, or the converted aequery object
 */
export function query(
	selector:
		| SelectorString
		| typeof CompItem
		| typeof Layer
		| typeof Property
		| any[],
	context?:
		| typeof CompItem
		| typeof FolderItem
		| typeof Layer
		| typeof PropertyGroup
		| any[],
) {
	'use strict'

	if (isNullOrUndefined(selector)) {
		return selector
	}

	let result

	if (isAeq(selector)) {
		result = selector
	} else if (isString(selector)) {
		result = select(selector, context)
	} else if (isArray(selector)) {
		result = arrayEx(selector)
	} else if (isApp(selector)) {
		result = aeqApp
	} else if (isComp(selector)) {
		result = new aeqComp(selector)
	} else if (isLayer(selector)) {
		result = new aeqLayer(selector)
	} else if (isProperty(selector)) {
		result = new aeqProperty(selector)
	}

	result.aeq = true

	return result
}

// export const version = version

// export const thisObj = this

/**
 * Used for setting the default value in functions. Returns the first argument
 * is not undefined, else it returns `defaultVal`.
 *
 * @method
 * @param  {Any} value      The value to check
 * @param  {Any} defaultVal The value to use if `value` is `undefined`
 * @return {Any}            `value` if it is not `undefined`, else `defaultVal`
 *
 * @example
 * function say( greeting ) {
 *     a = setDefault( greeting, 'Hello World!' )
 *     alert( a )
 * }
 */
export function setDefault(value, defaultVal) {
	return typeof value == 'undefined' ? defaultVal : value
}

// let setDefault = setDefault

// Copy of jQuery.extend
/**
 * Merge the contents of two or more objects together into the first object.
 *
 * If only one object is given, the `aeq` object is assumed to be the target.
 *
 * @method
 * @return {Object} The merged object
 * @see [jQuery.extend]{@link https://api.jquery.com/jquery.extend/} for more
 *      information, this function uses the same api.
 * @example
 * let objectA = {
 *     test: "example"
 * };
 *
 * extend( objectA, {
 *     prop: "prop"
 * });
 *
 * // ObjectA is now
 * {
 *     test: "example",
 *     prop: "prop"
 * }
 */
export function extend() {
	let options
	let name
	let src
	let copy
	let copyIsArray
	let clone
	let target = setDefault(arguments[0], {})
	let i = 1
	let length = arguments.length
	let deep = false

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target

		// Skip the boolean and the target
		target = setDefault(arguments[i], {})
		i++
	}

	// Handle case when target is a string or something (possible in deep copy)
	if (typeof target !== 'object' && !isFunction(target)) {
		target = {}
	}

	// Extend aeq itself if only one argument is passed
	if (i === length) {
		target = this
		i--
	}

	for (; i < length; i++) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) !== null) {
			// Extend the base object
			for (name in options) {
				// Skip modified prototype props
				if (!options.hasOwnProperty(name)) {
					continue
				}

				src = target[name]
				copy = options[name]

				// Prevent never-ending loop
				if (target === copy) {
					continue
				}

				// Recurse if we're merging plain objects or arrays
				if (
					deep &&
					copy &&
					(isPlainObject(copy) || (copyIsArray = isArray(copy)))
				) {
					if (copyIsArray) {
						copyIsArray = false
						clone = src && isArray(src) ? src : []
					} else {
						clone = src && isPlainObject(src) ? src : {}
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy)

					// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy
				}
			}
		}
	}

	// Return the modified object
	return target
}

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
