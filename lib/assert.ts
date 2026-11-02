import { isEmpty, isNullOrUndefined } from './types.ts'

/**
 * Checks if value is null. Throws an error if it is not.
 * @method
 * @param  {Any} o   The value to check against null.
 * @param  {String} err The error message to throw
 * @return {Boolean} `true` if no error was thrown
 */
export function assertIsNull(o, err) {
	if (isNullOrUndefined(o)) {
		return true
	}

	throw new Error(err)
}

/**
 * Checks if value is null. Throws an error if it is.
 * @method
 * @param  {Any} o   The value to check against null.
 * @param  {String} err The error message to throw
 * @return {Boolean} `true` if no error was thrown
 */
export function assertIsNotNull(o, err) {
	if (!isNullOrUndefined(o)) {
		return true
	}

	throw new Error(err)
}

/**
 * Checks if value is `true`. Throws an error if it is not.
 * @method
 * @param  {Any} o   The value to check against `true`.
 * @param  {String} err The error message to throw
 * @return {Boolean} `true` if no error was thrown
 */
export function assertIsTrue(o, err) {
	if (o === true) {
		return true
	}

	throw new Error(err)
}

/**
 * Checks if value is `false`. Throws an error if it is not.
 * @method
 * @param  {Any} o   The value to check against `false`.
 * @param  {String} err The error message to throw
 * @return {Boolean} `true` if no error was thrown
 */
export function assertIsFalse(o, err) {
	if (o === false) {
		return true
	}

	throw new Error(err)
}

/**
 * Checks if array is empty. Throws an error if it is not.
 * @method
 * @param  {Array} o   The array to check is empty.
 * @param  {String} err The error message to throw
 * @return {Boolean} `true` if no error was thrown
 */
export function assertIsEmpty(o, err) {
	if (isEmpty(o)) {
		return true
	}

	throw new Error(err)
}

/**
 * Checks if array is empty. Throws an error if it is.
 * @method
 * @param  {Array} o   The array to check is empty.
 * @param  {String} err The error message to throw
 * @return {Boolean} `true` if no error was thrown
 */
export function assertIsNotEmpty(o, err) {
	if (!isEmpty(o)) {
		return true
	}

	throw new Error(err)
}
