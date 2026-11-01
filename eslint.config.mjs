import { defineConfig } from 'eslint/config'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

export default defineConfig([
	{
		extends: compat.extends(),

		languageOptions: {
			globals: {
				...globals.browser,
				cssselector: true,
			},
		},

		rules: {
			// Requires plugin
			// https://github.com/gajus/eslint-plugin-jsdoc
			// "valid-jsdoc": ["error", {
			//     requireReturn: false,
			// }],
		},
	},
])
