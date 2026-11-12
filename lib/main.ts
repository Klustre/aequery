import * as aeqApp from './app.ts'
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
	isLayer,
	isNullOrUndefined,
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
