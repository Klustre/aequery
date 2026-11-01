import { forEach } from '../main'
import { isObject } from '../types'

/**
 * [settings description]
 * @namespace settings
 * @type {Object}
 */
export const settings = {
	setting,
	initSetting,
	get,
	getAsBool,
	getAsArray,
	getAsFloat,
	getAsInt,
	have,
	save,
	unpack,
}

/**
 * Saves setting if present, else gets setting
 * @method
 * @param  {string} sectionName Settings section name
 * @param  {string} keyName     Settings key name
 * @param  {string} [value]     Settings value to save for section:key
 * @return {aeq|string}         aeq or setting value of section:key
 */
export function setting(sectionName, keyName, value) {
	if (value !== undefined) {
		save(sectionName, keyName, value)
		return aeq
	}
	return get(sectionName, keyName)
}

/**
 * Initializes a setting, setting it if not present
 * @method
 * @param  {string} sectionName       Settings section name
 * @param  {string} keyName           Settings key name
 * @param  {string} value             Settings value to save for section:key
 * @param  {bool} 	[overwrite=false] `true` to overwite if present
 * @return {string}                   Setting value of section:key
 */
export function initSetting(sectionName, keyName, value, overwrite) {
	overwrite = setDefault(overwrite, false)

	if (!have(sectionName, keyName) || overwrite) {
		save(sectionName, keyName, value)
	}

	return get(sectionName, keyName)
}

/**
 * Gets setting from section:key
 * @method
 * @param  {string} sectionName Settings section name
 * @param  {string} keyName     Settings key name
 * @return {string|undefined}   Value of saved setting, or undefined if blank
 */
export function get(sectionName, keyName) {
	if (have(sectionName, keyName)) {
		return app.settings.getSetting(sectionName, keyName)
	}
	return undefined
}

/**
 * Gets setting and returns as boolean value, or undefined if not boolean
 * @method
 * @param  {string} sectionName Settings section name
 * @param  {string} keyName     Settings key name
 * @return {boolean|undefined}  Saved setting as boolean
 */
export function getAsBool(sectionName, keyName) {
	var value = get(sectionName, keyName)

	if (value === 'true') {
		return true
	} else if (value === 'false') {
		return false
	}

	return undefined
}

/**
 * Gets setting and returns as array
 * @method
 * @param  {string} sectionName Settings section name
 * @param  {string} keyName     Settings key name
 * @return {string[]|undefined} Saved setting as boolean
 */
export function getAsArray(sectionName, keyName) {
	return get(sectionName, keyName).split(',')
}

/**
 * Gets setting and returns as float
 * @method
 * @param  {string} sectionName Settings section name
 * @param  {string} keyName     Settings key name
 * @return {number|undefined}   Saved setting as float
 */
export function getAsFloat(sectionName, keyName) {
	return parseFloat(get(sectionName, keyName))
}

/**
 * Gets setting and returns as int
 * @method
 * @param  {string} sectionName Settings section name
 * @param  {string} keyName     Settings key name
 * @return {number|undefined}   Saved setting as int
 */
export function getAsInt(sectionName, keyName) {
	return parseInt(get(sectionName, keyName))
}

/**
 * Checks whether setting has been saved / exists in file
 * @method
 * @param  {string} sectionName Settings section name
 * @param  {string} keyName     Settings key name
 * @return {boolean}            Whether the setting exists
 */
export function have(sectionName, keyName) {
	return app.settings.haveSetting(sectionName, keyName)
}

/**
 * Saves setting
 * @method
 * @param  {string} sectionName Settings section name
 * @param  {string} keyName     Settings key name
 * @param  {string} value       Settings value to save for section:key
 */
export function save(sectionName, keyName, value) {
	app.settings.saveSetting(sectionName, keyName, value)
}

/**
 * Checks whether object of key names have saved settings,
 * returns object of saved values of this string
 * @method
 * @param  {string} sectionName Settings section name
 * @param  {object} keyNames    Object of containing key names
 * @return {object}             Object of fetched settings
 */
export function unpack(sectionName, keyNames) {
	var ret

	// Argument keyNames can either be an array with keyNames or an object with
	// key: defaultValue pairs.
	ret = isObject(keyNames) ? keyNames : {}

	forEach(keyNames, function (keyName) {
		if (app.settings.haveSetting(sectionName, keyName)) {
			ret[keyName] = app.settings.getSetting(sectionName, keyName)
		}
	})

	return ret
}

// Function aliases
export const saveSetting = save
export const setSetting = save
export const set = save
export const getSetting = get
export const getSettingAsBool = getAsBool
export const getSettingAsArray = getAsArray
export const getSettingAsFloat = getAsFloat
export const getSettingAsInt = getAsInt
export const haveSetting = have
export const unpackSettings = unpack
export const loadSettings = unpack
export const load = unpack
