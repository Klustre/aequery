import { getLayers } from '../dom.ts'
import { forEach } from '../main.ts'
import { arrayEx } from '../objects/array.ts'

const { Layer } = require('aftereffects')

/**
 * Copies the state of layer toggles from one layer to another.
 * Layer toggles: enabled, solo, shy, quality, effectsActive, motionBlur
 * adjustmentLayer, threeDLayer, blendingMode, preserveTransparency
 * parent, inPoint, stretch, startTime, outPoint, label, guideLayer
 * name, comment, autoOrient
 * @method
 * @param sourceLayer The layer to copy from.
 * @param destLayer The layer to copy to.
 */
export function copyLayerToggles(
	sourceLayer: typeof Layer,
	destLayer: typeof Layer,
) {
	const switches =
		'enabled solo shy quality effectsActive motionBlur ' +
		'adjustmentLayer threeDLayer blendingMode preserveTransparency ' +
		'parent inPoint stretch startTime outPoint label guideLayer ' +
		'name comment autoOrient'
	// switches = switches.split(' ')

	forEach(switches.split(' '), function (switchName) {
		destLayer[switchName] = sourceLayer[switchName]
	})
}

/**
 * Gets all layers that has the given layer as its parent.
 * @method
 * @param parentLayer The layer to get children from.
 * @return {arrayEx} The children Layers of the given Layer.
 */
export function children(parentLayer: typeof Layer) {
	const layers = getLayers(parentLayer.containingComp)
	return layers.filter(function (layer) {
		return layer.parent === parentLayer
	})
}
export { children as getLayerChildren }

/**
 * Gets all layers that has the given layer as its parent, and all layers
 * that has those layers, and so on.
 * @method
 * @param parentLayer The layer to get decendants from.
 * @return {arrayEx} Children and decendants of the given Layer.
 */
export function allChildren(parentLayer: typeof Layer) {
	let layers: (typeof Layer)[] = []
	const kids = children(parentLayer)
	forEach(kids, function (layer) {
		layers.push(layer)
		layers = layers.concat(allChildren(layer))
	})
	return arrayEx(layers)
}
export { children as getLayerChildrenRecursive }

/**
 * Gets the layers parent chain. I.e This layer's parent's parent, and so on.
 * @method
 * @param childLayer The layer to get parents from.
 * @return {arrayEx} The Parents of the given layer.
 */
export function parents(childLayer: typeof Layer) {
	const parents = arrayEx()
	let layer = childLayer
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
 * @param root The Layer to get the parents and children from
 * @return {arrayEx} The layer's parents and children.
 */
export function relatedLayers(root: typeof Layer) {
	let pars = parents(root)
	const children = allChildren(root)
	const all = pars.push.apply(pars, children)
	return arrayEx(all)
}
export { relatedLayers as getRelatedLayers }
