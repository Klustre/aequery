import { isArray } from '../types'

/**
 * Creates an undoGroup and wraps passed function in it
 * @method
 * @param  {string}    name     Undo group name
 * @param  {Function}  callback Function to wrap in undo group
 * @param  {any|array} args     Argument or array of arguments to pass to callback
 * @return {any}                Returned value from function
 */
export function createUndoGroup(name, callback, args) {
	app.beginUndoGroup(name)
	if (!isArray(args)) {
		args = [args]
	}
	var value = callback.apply(null, args)
	app.endUndoGroup()

	return value
}

/**
 * @see createUndoGroup
 * @function
 */
export const undoGroup = createUndoGroup
