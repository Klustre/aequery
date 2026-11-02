import { isArray } from '../types.ts'

const { app } = require('aftereffects')

/**
 * Creates an undoGroup and wraps passed function in it
 * @method
 * @param name Undo group name
 * @param  {Function}  callback Function to wrap in undo group
 * @param args Argument or array of arguments to pass to callback
 * @return Returned value from function
 */
export function createUndoGroup(name: string, callback, args: any | any[]) {
	app.beginUndoGroup(name)
	if (!isArray(args)) {
		args = [args]
	}
	var value = callback.apply(null, args)
	app.endUndoGroup()
	return value
}
export { createUndoGroup as undoGroup }
