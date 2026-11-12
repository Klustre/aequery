import { isArray, isFunction, isPlainObject } from './types.ts'

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

/**
 * Merge the contents of two or more objects together into the first object.
 *
 * If only one object is given, the `aeq` object is assumed to be the target.
 *
 * @method
 * @return {Object} The merged object
 * @see [jQuery.extend]{@link https://api.jquery.com/jquery.extend/} for more information, this function uses the same api.
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
