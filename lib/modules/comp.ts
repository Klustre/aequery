import { extend, filter, setDefault } from '../main.ts'
import { isComp, isFolderItem, isNullOrUndefined } from '../types.ts'
import { getQueuedItems, getRQItems } from './renderqueue.ts'

const { app, CompItem, RenderQueueItem, FolderItem } = require('aftereffects')

/**
 * Creates a comp with the given settings
 * @method
 * @param  {FolderItem|object} [folder=app.project]  The folder to place the
 *         comp inside in the project panel. If not provided, this argument
 *         will be used as the `options` parameter.
 * @param  {object} [options] Comp settings:
 * @param  {string} [options.name=Comp] The name of the comp.
 * @param  {number} [options.width=1920] Comp width, in pixels.
 * @param  {number} [options.height=1080] Comp height, in pixels.
 * @param  {number} [options.pixelAspect=1] Comp pixel aspect ratio.
 * @param  {number} [options.duration=1] Comp duration, in seconds.
 * @param  {number} [options.frameRate=24] Comp frame rate.
 * @return {CompItem}  The created comp item.
 *
 * @example <caption>Create a comp in the project root, with name "Example",
 *          and a duration of 10 seconds. And use default values for the
 *          other options</caption>
 * const comp = create({
 *     name: 'Example',
 *     duration: 10
 * })
 *
 * @example <caption>Create comp in a folder, with name "Example"</caption>
 * const comp = create(compFolder, {
 *     name: "Example"
 * })
 *
 * @example <caption>Create a comp with all default values</caption>
 * const comp = create()
 */
export function create(folder, options) {
	if (!isFolderItem(folder)) {
		options = setDefault(folder, {})
		folder = setDefault(options.folder, app.project)
	}

	// TODO: Find a way to use the last used settings, or find some defaults
	let defaultOptions = {
		name: 'Comp',
		width: 1920,
		height: 1080,
		pixelAspect: 1,
		duration: 1,
		frameRate: 24,
	}

	options = extend(defaultOptions, options)

	return folder.items.addComp(
		options.name,
		options.width,
		options.height,
		options.pixelAspect,
		options.duration,
		options.frameRate,
	)
}
export { create as createComp }

/**
 * Gets the `RenderQueueItem`s that references a given comp.
 * @method
 * @param comp The comp to find in the Render Queue.
 * @param queuedOnly Only get `RenderQueueItem`s that are queued.
 * @return {RenderQueueItem[]} The `RenderQueueItem`s that references the comp
 *
 * @example
 * <caption>Get all `RenderQueueItem`s that references the comp.</caption>
 * const RQItems = getCompInQueue( comp, false )
 */
export function getCompInQueue(comp: typeof CompItem, queuedOnly = true) {
	const queuedItems: (typeof RenderQueueItem)[] = queuedOnly
		? getQueuedItems()
		: getRQItems()

	return filter(queuedItems, function (item) {
		return item.comp.id === comp.id
	})
}

/**
 * Check if a comp is in the Render Queue, regardless of it being
 * queued or not.
 * @method
 * @param comp The comp to find in the queue.
 * @return True if comp is in the queue.
 */
export function isInQueue(comp: typeof CompItem) {
	if (!isComp(comp)) {
		// TODO: Should throw an error instead
		return false
	}

	const items = getRQItems()

	return items.some(function (item) {
		return item.comp.id === comp.id
	})
}
export { isInQueue as isCompInQueue }

/**
 * Check if a comp is in the Render Queue and queued.
 * @method
 * @param comp The comp to find the queue.
 * @return True if the comp is queued.
 */
export function isQueued(comp: typeof CompItem) {
	return getCompInQueue(comp, true).length > 0
}
export { isQueued as isCompQueued }
