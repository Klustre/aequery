import { getLayers } from '../dom'
import { forEach } from '../main'
import { arrayEx } from '../objects/array'

/**
 * Copies the state of layer toggles from one layer to another.
 * Layer toggles: enabled, solo, shy, quality, effectsActive, motionBlur
 * adjustmentLayer, threeDLayer, blendingMode, preserveTransparency
 * parent, inPoint, stretch, startTime, outPoint, label, guideLayer
 * name, comment, autoOrient
 * @method
 * @param  {Layer} sourceLayer The layer to copy from.
 * @param  {Layer} destLayer   The layer to copy to.
 */
export function copyLayerToggles(sourceLayer, destLayer) {
	var switches =
		'enabled solo shy quality effectsActive motionBlur ' +
		'adjustmentLayer threeDLayer blendingMode preserveTransparency ' +
		'parent inPoint stretch startTime outPoint label guideLayer ' +
		'name comment autoOrient'
	switches = switches.split(' ')

	forEach(switches, function (switchName) {
		destLayer[switchName] = sourceLayer[switchName]
	})
}

/**
 * Gets all layers that has the given layer as its parent.
 * @method
 * @param  {Layer} parentLayer The layer to get children from.
 * @return {arrayEx}           The children Layers of the given Layer.
 */
export function children(parentLayer) {
	var layers = getLayers(parentLayer.containingComp)
	return layers.filter(function (layer) {
		return layer.parent === parentLayer
	})
}
export { children as getLayerChildren }

/**
 * Gets all layers that has the given layer as its parent, and all layers
 * that has those layers, and so on.
 * @method
 * @param  {Layer} parentLayer The layer to get decendants from.
 * @return {arrayEx}           Children and decendants of the given Layer.
 */
export function allChildren(parentLayer) {
	var all = []
	var childs = children(parentLayer)
	forEach(childs, function (layer) {
		all.push(layer)
		all = all.concat(allChildren(layer))
	})
	return arrayEx(all)
}
export { children as getLayerChildrenRecursive }

/**
 * Gets the layers parent chain. I.e This layer's parent's parent, and so on.
 * @method
 * @param  {Layer} childLayer The layer to get parents from.
 * @return {arrayEx}          The Parents of the given layer.
 */
export function parents(childLayer) {
	var parents = arrayEx()
	var layer = childLayer
	while (layer.parent !== null) {
		parents.push(layer.parent)
		layer = layer.parent
	}
	return parents
}
export { parents as getLayerParentsRecursive }

/**
 * Gets all [parents]{@link parents} and
 * [all children]{@link allChildren} of the given layers.
 * @method
 * @param  {Layer} root The Layer to get the parents and children from
 * @return {arrayEx}    The layer's parents and children.
 */
export function relatedLayers(root) {
	var pars = parents(root)
	var children = allChildren(root)
	var all = pars.push.apply(pars, children)
	return arrayEx(all)
}
export { relatedLayers as getRelatedLayers }
