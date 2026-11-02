import { isEmpty, isNullOrUndefined } from './types.ts'

/**
 * Checks if value is null. Throws an error if it is not.
 * @method
 * @param o The value to check against null.
 * @param err The error message to throw
 * @return `true` if no error was thrown
 */
export function assertIsNull(o: any, err: string) {
	if (isNullOrUndefined(o)) {
		return true
	}
	throw new Error(err)
}

/**
 * Checks if value is null. Throws an error if it is.
 * @method
 * @param o The value to check against null.
 * @param err The error message to throw
 * @return `true` if no error was thrown
 */
export function assertIsNotNull(o: any, err: string) {
	if (!isNullOrUndefined(o)) {
		return true
	}
	throw new Error(err)
}

/**
 * Checks if value is `true`. Throws an error if it is not.
 * @method
 * @param o The value to check against `true`.
 * @param err The error message to throw
 * @return `true` if no error was thrown
 */
export function assertIsTrue(o: any, err: string) {
	if (o === true) {
		return true
	}
	throw new Error(err)
}

/**
 * Checks if value is `false`. Throws an error if it is not.
 * @method
 * @param o The value to check against `false`.
 * @param err The error message to throw
 * @return `true` if no error was thrown
 */
export function assertIsFalse(o: any, err: string) {
	if (o === false) {
		return true
	}
	throw new Error(err)
}

/**
 * Checks if array is empty. Throws an error if it is not.
 * @method
 * @param  {Array} o   The array to check is empty.
 * @param err The error message to throw
 * @return `true` if no error was thrown
 */
export function assertIsEmpty(o: any, err: string) {
	if (isEmpty(o)) {
		return true
	}
	throw new Error(err)
}

/**
 * Checks if array is empty. Throws an error if it is.
 * @method
 * @param  {Array} o   The array to check is empty.
 * @param err The error message to throw
 * @return `true` if no error was thrown
 */
export function assertIsNotEmpty(o: any, err: string) {
	if (!isEmpty(o)) {
		return true
	}
	throw new Error(err)
}
