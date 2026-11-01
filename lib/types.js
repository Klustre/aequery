/**
 * Returns `true` if argument is null or undefined, false otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is null/undefined
 */
export function isNullOrUndefined(o) {
	// Using truthiness to capture both 'undefined' and 'null'
	return o == null
}

/**
 * Returns `true` if argument is a boolean (`true` or `false`),
 * `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a boolean
 */
export function isBoolean(o) {
	return typeof o === 'boolean'
}

/**
 * Returns `true` if argument is a number, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a number
 */
export function isNumber(o) {
	return typeof o === 'number'
}

/**
 * Returns `true` if argument is a string, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a string
 */
export function isString(o) {
	return typeof o === 'string'
}

/**
 * Returns `true` if argument is an object, `false` otherwise. This will most
 * likely return `true` most of the time, as most things are objects. Try to
 * use a different function to check the type, if applicable.
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is an object
 */
export function isObject(o) {
	return o instanceof Object
}

/**
 * Returns `true` if argument is a plain object, i.e an object created
 * using `{}` or `new Object()`, `false` otherwise
 * @function
 * @param  {Any} obj The value to check
 * @return {Boolean} Whether the value is a plain object
 */
export function isPlainObject(obj) {
	// Not plain objects:
	// - Any object or value whose internal [[Class]] property is not "[object Object]"
	// - After Effects objects
	if (obj === undefined || obj === null) {
		return false
	}
	if (obj.toString() !== '[object Object]') {
		return false
	}

	if (obj.constructor && !obj.constructor.prototype.hasOwnProperty('isPrototypeOf')) {
		return false
	}

	// If the function hasn't returned already, we're confident that
	// |obj| is a plain object, created by {} or constructed with new Object
	return true
}

/**
 * Returns `true` if argument is an array, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is an array
 */
export function isArray(o) {
	return o instanceof Array
}

/**
 * Returns `true` if the passed array is empty, `false` otherwise
 * @function
 * @param  {Array} o The array to check
 * @return {Boolean} Whether the array is empty
 */
export function isEmpty(o) {
	return o.length === undefined || o.length === 0
}

/**
 * Returns `true` if argument is a function, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a function
 */
export function isFunc(o) {
	return o instanceof Function
}

/**
 * ???
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} [description]
 */
export function isAeq(o) {
	return o instanceof Object && o.isAeq === true
}

/**
 * Returns `true` if argument is the Application object, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is the Application object
 */
export function isApp(o) {
	return o instanceof Application
}

/**
 * Returns `true` if argument is a Folder object, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a folder
 */
export function isFolder(o) {
	return o instanceof Folder
}

/**
 * Returns `true` if argument is a File object, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a File
 */
export function isFile(o) {
	return o instanceof File
}

/**
 * Returns `true` if argument is a FolderItem, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a FolderItem
 */
export function isFolderItem(o) {
	return o instanceof FolderItem
}

/**
 * Returns `true` if argument is a FootageItem, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a FootageItem
 */
export function isFootageItem(o) {
	return o instanceof FootageItem
}

/**
 * Returns `true` if argument is a Compitem, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a Compitem
 */
export function isComp(o) {
	return o instanceof CompItem
}

/**
 * Returns `true` if argument is an AVLayer, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is an AVLayer
 */
export function isAVLayer(o) {
	return o instanceof AVLayer
}

/**
 * Returns `true` if argument is a ShapeLayer, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a ShapeLayer
 */
export function isShapeLayer(o) {
	return o instanceof ShapeLayer
}

/**
 * Returns `true` if argument is a TextLayer, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a TextLayer
 */
export function isTextLayer(o) {
	return o instanceof TextLayer
}

/**
 * Returns `true` if argument is a CameraLayer, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a CameraLayer
 */
export function isCameraLayer(o) {
	return o instanceof CameraLayer
}

/**
 * Returns `true` if argument is a LightLayer, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a LightLayer
 */
export function isLightLayer(o) {
	return o instanceof LightLayer
}

/**
 * Returns `true` if a layer is a precomp, `false` otherwise
 * @function
 * @param  {Layer} o The layer to check
 * @return {Boolean} Whether the layer is a precomp
 */
export function isPrecomp(o) {
	if (!isLayer(o)) {
		return false
	}
	return isComp(o.source)
}

/**
 * Returns `true` if argument is any kind of layer, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a layer
 */
export function isLayer(o) {
	return isAVLayer(o) || isShapeLayer(o) || isTextLayer(o) || isCameraLayer(o) || isLightLayer(o)
}

/**
 * Returns `true` if argument is a Property, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a Property
 */
export function isProperty(o) {
	return o instanceof Property
}

/**
 * Returns `true` if argument is a PropertyGroup, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a PropertyGroup
 */
export function isPropertyGroup(o) {
	return o instanceof PropertyGroup
}

/**
 * Returns `true` if argument is a MaskPropertyGroup, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a MaskPropertyGroup
 */
export function isMaskPropertyGroup(o) {
	return o instanceof MaskPropertyGroup
}

/**
 * Returns `true` if argument is a Panel object, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a Panel
 */
export function isPanel(o) {
	return o instanceof Panel
}

/**
 * Returns `true` if argument is a Window object, `false` otherwise
 * @function
 * @param  {Any} o   The value to check
 * @return {Boolean} Whether the value is a Window
 */
export function isWindow(o) {
	return o instanceof Window
}

/**
 * ???
 * @function
 * @param  {Object} obj The object
 * @return {String}     [description]
 */
export function reflect(obj) {
	var str = []

	for (var m in obj) {
		if (obj.hasOwnProperty(m)) {
			str.push(obj[m].constructor.name + ' ' + m + '=' + obj[m])
		}
	}

	return str.join()
}

// Function Aliases

/**
 * @see isBoolean
 * @function
 */
export const isBool = isBoolean

/**
 * @see isNumber
 * @function
 */
export const isNum = isNumber

/**
 * @see isString
 * @function
 */
export const isStr = isString

/**
 * @see isObject
 * @function
 */
export const isObj = isObject

/**
 * @see isArray
 * @function
 */
export const isArr = isArray

/**
 * @see isFunc
 * @function
 */
export const isFunction = isFunc

/**
 * @see isComp
 * @function
 */
export const isComposition = isComp

/**
 * @see isProperty
 * @function
 */
export const isProp = isProperty

/**
 * @see isFolder
 * @function
 */
export const isDir = isFolder
/**
 * @see isFolder
 * @function
 */
export const isDirectory = isFolder

/**
 * @see isCameraLayer
 * @function
 */
export const isCamera = isCameraLayer

/**
 * @see isLightLayer
 * @function
 */
export const isLight = isLightLayer
