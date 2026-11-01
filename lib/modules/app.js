/**
 * The After Effects version
 * @type {number}
 */
export const version = parseFloat(app.version)

/**
 * Checks whether AE security pref is enabled
 * @method
 * @return {boolean} Security pref status
 */
export function securityPrefEnabled() {
	return (
		app.preferences.getPrefAsLong(
			'Main Pref Section',
			'Pref_SCRIPTING_FILE_NETWORK_SECURITY',
		) === 1
	)
}

/**
 * Gets user data folder; In Windows: the value of %USERDATA% (by default,
 * C:\Documents and Settings\username\Application Data) In Mac OS:
 * ~/Library/Application Support
 * @method
 * @return {Folder} User data folder
 */
export function getUserDataFolder() {
	return Folder.userData
}

/**
 * Gets current script file object
 * @method
 * @return {File} File object of current script
 */
export function getScriptFile() {
	return getFile($.fileName)
}

/**
 * Gets current AEP file object
 * @method
 * @return {File} File object of current AEP
 */
export function getAEP() {
	return app.project.file
}

/**
 * Gets folder containing current AEP, or null if AEP is not saved
 * @method
 * @return {Folder|null} Parent directory of current AEP
 */
export function getAEPDir() {
	var aepFile = getAEP()

	if (!aepFile) {
		return null
	}

	return getFolder(aepFile.path)
}

/**
 * Gets filename of current AEP, or null if AEP is not saved
 * @method
 * @return {string|null} Filename of current AEP
 */
export function getAEPName() {
	var aepFile = getAEP()
	if (!aepFile) {
		return null
	}
	return stripExtension(aepFile.displayName)
}

/**
 * Gets array of both default preset folder paths
 * One in the user directory, one in the AE install directory
 * @method
 * @return {string[]} Array of preset folder paths
 */
export function getPresetsPaths() {
	var appVersion = aeqApp.version
	var versionPrettyName = ''

	if (parseInt(appVersion) === 11) {
		versionPrettyName = 'CS6'
	} else if (parseInt(appVersion) === 12) {
		versionPrettyName = 'CC'
	} else if (appVersion >= 13.0 && appVersion < 13.5) {
		versionPrettyName = 'CC 2014'
	} else if (appVersion >= 13.5 && appVersion < 14.0) {
		versionPrettyName = 'CC 2015'
	} else if (appVersion >= 14.0) {
		versionPrettyName = 'CC 2017'
	}

	return [
		Folder.current.fullName + '/Presets/',
		Folder.myDocuments.fullName +
			'/Adobe/After Effects ' +
			versionPrettyName +
			'/User Presets/',
	]
}

/**
 * Checks security pref setting, prompting user to enable it if not
 * Throws an error if user declines prompt
 * @method
 */
export function ensureSecurityPrefEnabled() {
	if (!securityPrefEnabled()) {
		if (
			confirm(
				'This script requires access to write files.\n' +
					'Go to the "General" panel of the application preferences and ensure\n' +
					'"Allow Scripts to Write Files and Access Network" is checked.\n\nOpen prefs now?',
			)
		) {
			app.executeCommand(2359) // Launch prefs
		}

		if (!securityPrefEnabled()) {
			throw new Error("Security preference is not enabled! Can't continue.")
		}
	}
}

/**
 * Opens an AEP
 * @method
 * @param  {File|string} filePath AEP path or file object to open
 * @return {File}                 Newly-opened AEP
 */
export function open(filePath) {
	var file = getFile(filePath)

	if (file) {
		return app.open(file)
	}

	return app.open()
}
