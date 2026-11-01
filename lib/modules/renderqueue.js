import { normalizeCollection } from '../dom'
import { arrayEx } from '../objects/array'
import { ensureSecurityPrefEnabled } from './app'
import { create } from './comp'

/**
 * Add a project item to the render queue.
 * @method
 * @param  {Item|CompItem} item The item to add to the queue.
 * @return {RenderQueueItem}      The added RenderQueueItem.
 */
export function queue(item) {
	return app.project.renderQueue.items.add(item)
}

/**
 * Unqueues all items in the render queue
 * @method
 */
export function unqueueAll() {
	var items = getRQItems()

	items.forEach(function (item) {
		if (
			item.status !== RQItemStatus.USER_STOPPED &&
			item.status !== RQItemStatus.ERR_STOPPED &&
			item.status !== RQItemStatus.RENDERING &&
			item.status !== RQItemStatus.DONE
		) {
			item.render = false
		}
	})
}

/**
 * Removes all items from the render queue.
 * @method
 */
export function clear() {
	var items = getRQItems()
	items = items.reverse()
	items.forEach(function (item) {
		item.remove()
	})
}

/**
 * Check if an item in the render queue is queued for rendering.
 * @method
 * @param  {RenderQueueItem} rqItem The item to check.
 * @return {boolean}        `true` if the item is going to be rendered.
 */
export function isQueued(rqItem) {
	return rqItem.status === RQItemStatus.QUEUED
}

/**
 * Gets all `RenderQueueItem`s in the render queue which are queued for
 * rendering.
 * @method
 * @return {arrayEx} ArrayEx of `RenderQueueItem`s
 */
export function getQueuedItems() {
	var items = getRQItems()
	return items.filter(function (item) {
		return isQueued(item)
	})
}

/**
 * Gets all `CompItem`s that are queued for rendering.
 * @method
 * @return {arrayEx} ArrayEx of `CompItem`s
 */
export function getQueuedComps() {
	var queuedItems = getQueuedItems()
	var compIDs = {}
	var comps = []

	queuedItems.forEach(function (item) {
		var comp = item.comp
		var compID = comp.id

		if (compIDs[compID] === undefined) {
			compIDs[compID] = true
			comps.push(comp)
		}
	})

	return arrayEx(comps)
}

/**
 * Gets all render queue items.
 * @method
 * @return {arrayEx} ArrayEx of `RenderQueueItem`s
 */
export function getRQItems() {
	return arrayEx(normalizeCollection(app.project.renderQueue.items))
}

/**
 * Gets all `compItem`s added to the render queue.
 * @method
 * @return {arrayEx} ArrayEx of CompItems in the render queue.
 */
export function getRQComps() {
	var rqItems = getRQItems()
	var compIDs = {}
	var comps = []

	rqItems.forEach(function (item) {
		var comp = item.comp
		var compID = comp.id

		if (compIDs[compID] === undefined) {
			compIDs[compID] = true
			comps.push(comp)
		}
	})

	return arrayEx(comps)
}

/**
 * Gets settings from a `RenderQueueItem` or `OutputModule`.
 * @see [OutputModule.getSettings]{@link
 * http://docs.aenhancers.com/outputmodule/#outputmodule-getsettings}
 * @see [RenderQueueItem.getSettings]{@link
 * http://docs.aenhancers.com/renderqueueitem/#renderqueueitem-getsettings}
 * @method
 * @param  {RenderQueueItem|OutputModule} renderItem The object to get settings
 * from.
 * @return {Object}        Object with render settings as strings.
 */
export function getSettings(renderItem) {
	return renderItem.getSettings(GetSettingsFormat.STRING)
}

/**
 * Checks if the folder where the output module is rendering to exists, if
 * it does not exist, it gets created.
 * @method
 * @param  {OutputModule} outputModule The output module to check the render
 *                                     path of.
 */
export function ensureRenderPathExists(outputModule) {
	ensureSecurityPrefEnabled()
	ensureFolderExists(outputModule.file.parent)
}

/**
 * Checks if the given output module template exists.
 * @method
 * @param  {string} templateName Name of the template to check if exists.
 * @return {boolean}             `true` if the output module template exists.
 */
export function omTemplateExists(templateName) {
	var tempComp = create()
	var tempRQItem = queue(tempComp)
	var templates = arrayEx(tempRQItem.outputModule(1).templates)

	var templateExists = templates.some(function (template) {
		return template === templateName
	})

	tempRQItem.remove()
	tempComp.remove()
	return templateExists
}

/**
 * Checks if the given render queue template exists.
 * @method
 * @param  {string} templateName Name of the template to check.
 * @return {boolean}             `true` if the template exists.
 */
export function rqTemplateExists(templateName) {
	var tempComp = create()
	var tempRQItem = queue(tempComp)
	var templates = arrayEx(tempRQItem.templates)

	var templateExists = templates.some(function (template) {
		return template === templateName
	})

	tempRQItem.remove()
	tempComp.remove()
	return templateExists
}
