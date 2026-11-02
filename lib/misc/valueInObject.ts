const { PropertyType } = require('aftereffects')

/**
 * [description]
 * @method
 * @param  {type} value [description]
 * @param  {type} obj   [description]
 * @return {type}       [description]
 */
export function valueInObject(value, obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (value === obj[key]) {
				return key
			}
		}
	}
	return undefined
}

/**
 * [description]
 * @method
 * @param  {type} property [description]
 * @return {type}          [description]
 */
export function propertyType(property) {
	// Uses the propertyType attribute if it is not undefined
	return valueInObject(property.propertyType || property, PropertyType)
}
