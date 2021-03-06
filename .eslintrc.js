module.exports = {
	parser: "@typescript-eslint/parser", // Specifies the ESLint parser
	extends: [
		// Uses the recommended rules from @eslint-plugin-react
		"plugin:react/recommended",
		// Uses the recommended rules from @typescript-eslint/eslint-plugin
		"plugin:@typescript-eslint/recommended",
		// Uses eslint-config-prettier to disable ESLint rules from
		// @typescript-eslint/eslint-plugin that would conflict with prettier
		"prettier/@typescript-eslint",
		// Enables eslint-plugin-prettier and eslint-config-prettier.
		// This will display prettier errors as ESLint errors. Make sure this is
		// always the last configuration in the extends array.
		"plugin:prettier/recommended",
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true, // Allows for the parsing of JSX
		},
	},
	rules: {
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
	},
	settings: {
		react: {
			version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
		},
	},
};
