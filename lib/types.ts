const {
	CompItem,
	LightLayer,
	FolderItem,
	FootageItem,
	AVLayer,
	ShapeLayer,
	TextLayer,
	CameraLayer,
	Layer,
	Property,
	PropertyGroup,
	MaskPropertyGroup,
	Application,
} = require('aftereffects')

/**
 * Returns `true` if argument is null or undefined, false otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is null/undefined
 */
export function isNullOrUndefined(o: any) {
	// Using truthiness to capture both 'undefined' and 'null'
	return o == null
}

/**
 * Returns `true` if argument is a boolean (`true` or `false`),
 * `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a boolean
 */
export function isBoolean(o: any) {
	return typeof o === 'boolean'
}
export { isBoolean as isBool }

/**
 * Returns `true` if argument is a number, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a number
 */
export function isNumber(o: any) {
	return typeof o === 'number'
}
export { isNumber as isNum }

/**
 * Returns `true` if argument is a string, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a string
 */
export function isString(o: any) {
	return typeof o === 'string'
}
export { isString as isStr }

/**
 * Returns `true` if argument is an object, `false` otherwise. This will most
 * likely return `true` most of the time, as most things are objects. Try to
 * use a different function to check the type, if applicable.
 * @function
 * @param o The value to check
 * @return Whether the value is an object
 */
export function isObject(o: any) {
	return o instanceof Object
}
export { isObject as isObj }

/**
 * Returns `true` if argument is a plain object, i.e an object created
 * using `{}` or `new Object()`, `false` otherwise
 * @function
 * @param obj The value to check
 * @return Whether the value is a plain object
 */
export function isPlainObject(obj: any) {
	// Not plain objects:
	// - Any object or value whose internal [[Class]] property is not "[object Object]"
	// - After Effects objects
	if (obj === undefined || obj === null) {
		return false
	}
	if (obj.toString() !== '[object Object]') {
		return false
	}

	if (
		obj.constructor &&
		!obj.constructor.prototype.hasOwnProperty('isPrototypeOf')
	) {
		return false
	}

	// If the function hasn't returned already, we're confident that
	// |obj| is a plain object, created by {} or constructed with new Object
	return true
}

/**
 * Returns `true` if argument is an array, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is an array
 */
export function isArray(o: any) {
	return o instanceof Array
}
export { isArray as isArr }

/**
 * Returns `true` if the passed array is empty, `false` otherwise
 * @function
 * @param  {Array} o The array to check
 * @return Whether the array is empty
 */
export function isEmpty(o: any) {
	return o.length === undefined || o.length === 0
}

/**
 * Returns `true` if argument is a function, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a function
 */
export function isFunc(o: any) {
	return o instanceof Function
}
export { isFunc as isFunction }

/**
 * ???
 * @function
 * @param o The value to check
 * @return [description]
 */
export function isAeq(o: any) {
	return o instanceof Object && o.isAeq === true
}

/**
 * Returns `true` if argument is the Application object, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is the Application object
 */
export function isApp(o: any) {
	return o instanceof Application
}

/**
 * Returns `true` if argument is a Folder object, `false` otherwise
 * @deprecated
 */
export function isFolder() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}
export { isFolder as isDir }
export { isFolder as isDirectory }

/**
 * Returns `true` if argument is a File object, `false` otherwise
 * @deprecated
 */
export function isFile() {
	throw new Error('Deprecated. Use UXP APIs instead.')
}

/**
 * Returns `true` if argument is a FolderItem, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a FolderItem
 */
export function isFolderItem(o: any) {
	return o instanceof FolderItem
}

/**
 * Returns `true` if argument is a FootageItem, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a FootageItem
 */
export function isFootageItem(o: any) {
	return o instanceof FootageItem
}

/**
 * Returns `true` if argument is a Compitem, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a Compitem
 */
export function isComp(o: any) {
	return o instanceof CompItem
}
export { isComp as isComposition }

/**
 * Returns `true` if argument is an AVLayer, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is an AVLayer
 */
export function isAVLayer(o: any) {
	return o instanceof AVLayer
}

/**
 * Returns `true` if argument is a ShapeLayer, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a ShapeLayer
 */
export function isShapeLayer(o: any) {
	return o instanceof ShapeLayer
}

/**
 * Returns `true` if argument is a TextLayer, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a TextLayer
 */
export function isTextLayer(o: any) {
	return o instanceof TextLayer
}

/**
 * Returns `true` if argument is a CameraLayer, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a CameraLayer
 */
export function isCameraLayer(o: any) {
	return o instanceof CameraLayer
}
export { isCameraLayer as isCamera }

/**
 * Returns `true` if argument is a LightLayer, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a LightLayer
 */
export function isLightLayer(o: any) {
	return o instanceof LightLayer
}
export { isLightLayer as isLight }

/**
 * Returns `true` if a layer is a precomp, `false` otherwise
 * @function
 * @param  {Layer} o The layer to check
 * @return Whether the layer is a precomp
 */
export function isPrecomp(o: any) {
	if (!isLayer(o)) {
		return false
	}
	return isComp(o.source)
}

/**
 * Returns `true` if argument is any kind of layer, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a layer
 */
export function isLayer(o: any) {
	return (
		isAVLayer(o) ||
		isShapeLayer(o) ||
		isTextLayer(o) ||
		isCameraLayer(o) ||
		isLightLayer(o)
	)
}

/**
 * Returns `true` if argument is a Property, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a Property
 */
export function isProperty(o: any) {
	return o instanceof Property
}
export { isProperty as isProp }

/**
 * Returns `true` if argument is a PropertyGroup, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a PropertyGroup
 */
export function isPropertyGroup(o: any) {
	return o instanceof PropertyGroup
}

/**
 * Returns `true` if argument is a MaskPropertyGroup, `false` otherwise
 * @function
 * @param o The value to check
 * @return Whether the value is a MaskPropertyGroup
 */
export function isMaskPropertyGroup(o: any) {
	return o instanceof MaskPropertyGroup
}

/**
 * ???
 * @function
 * @param obj The object
 * @return [description]
 */
export function reflect(obj: Record<string, any>) {
	var str = []

	for (var m in obj) {
		if (obj.hasOwnProperty(m)) {
			str.push(obj[m].constructor.name + ' ' + m + '=' + obj[m])
		}
	}

	return str.join()
}
