import { forEach } from '../main.ts'
import { isObject } from '../types.ts'

const { app } = require('aftereffects')

/**
 * Saves setting if present, else gets setting
 * @method
 * @param sectionName Settings section name
 * @param keyName Settings key name
 * @param value Settings value to save for section:key
 * @return {string} setting value of section:key
 */
export function setting(sectionName: string, keyName: string, value?: string) {
	if (value !== undefined) {
		save(sectionName, keyName, value)
	}
	return get(sectionName, keyName)
}

/**
 * Initializes a setting, setting it if not present
 * @method
 * @param sectionName Settings section name
 * @param keyName Settings key name
 * @param value Settings value to save for section:key
 * @param overwrite `true` to overwite if present
 * @return {string} Setting value of section:key
 */
export function initSetting(
	sectionName: string,
	keyName: string,
	value: string,
	overwrite = false,
) {
	if (!have(sectionName, keyName) || overwrite) {
		save(sectionName, keyName, value)
	}
	return get(sectionName, keyName)
}

/**
 * Gets setting from section:key
 * @method
 * @param sectionName Settings section name
 * @param keyName Settings key name
 * @return {string|undefined} Value of saved setting, or undefined if blank
 */
export function get(sectionName: string, keyName: string) {
	if (have(sectionName, keyName)) {
		return app.settings.getSetting(sectionName, keyName)
	}
	return undefined
}
export { get as getSetting }

/**
 * Gets setting and returns as boolean value, or undefined if not boolean
 * @method
 * @param sectionName Settings section name
 * @param keyName Settings key name
 * @return {boolean|undefined}  Saved setting as boolean
 */
export function getAsBool(sectionName: string, keyName: string) {
	const value = get(sectionName, keyName)
	if (value === 'true') {
		return true
	} else if (value === 'false') {
		return false
	}
	return undefined
}
export { getAsBool as getSettingAsBool }

/**
 * Gets setting and returns as array
 * @method
 * @param sectionName Settings section name
 * @param keyName Settings key name
 * @return {string[]|undefined} Saved setting as boolean
 */
export function getAsArray(sectionName: string, keyName: string) {
	return get(sectionName, keyName).split(',')
}
export { getAsArray as getSettingAsArray }

/**
 * Gets setting and returns as float
 * @method
 * @param sectionName Settings section name
 * @param keyName Settings key name
 * @return {number|undefined} Saved setting as float
 */
export function getAsFloat(sectionName: string, keyName: string) {
	return parseFloat(get(sectionName, keyName))
}
export { getAsFloat as getSettingAsFloat }

/**
 * Gets setting and returns as int
 * @method
 * @param sectionName Settings section name
 * @param keyName Settings key name
 * @return {number|undefined}   Saved setting as int
 */
export function getAsInt(sectionName: string, keyName: string) {
	return parseInt(get(sectionName, keyName))
}
export { getAsInt as getSettingAsInt }

/**
 * Checks whether setting has been saved / exists in file
 * @method
 * @param sectionName Settings section name
 * @param keyName Settings key name
 * @return {boolean} Whether the setting exists
 */
export function have(sectionName: string, keyName: string) {
	return app.settings.haveSetting(sectionName, keyName)
}
export { have as haveSetting }
export { have as hasSetting }

/**
 * Saves setting
 * @method
 * @param sectionName Settings section name
 * @param keyName Settings key name
 * @param value Settings value to save for section:key
 */
export function save(sectionName: string, keyName: string, value: string) {
	app.settings.saveSetting(sectionName, keyName, value)
}
export { save as saveSetting }
export { save as setSetting }
export { save as set }

/**
 * Checks whether object of key names have saved settings,
 * returns object of saved values of this string
 * @method
 * @param sectionName Settings section name
 * @param keyNames Object of containing key names
 * @return {object} Object of fetched settings
 */
export function unpack(
	sectionName: string,
	keyNames: string[] | Record<string, string>,
) {
	// TODO: Looks like a bug. If keyNames is not of type Object it will be ignored.
	// It should instead throw an error when keyNames is not of the expected type.

	// Argument keyNames can either be an array with keyNames or an object with
	// key: defaultValue pairs.
	let ret = isObject(keyNames) ? keyNames : {}
	forEach(keyNames, function (keyName) {
		if (app.settings.haveSetting(sectionName, keyName)) {
			ret[keyName] = app.settings.getSetting(sectionName, keyName)
		}
	})

	return ret
}
export { unpack as unpackSettings }
export { unpack as loadSettings }
export { unpack as load }
