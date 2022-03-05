module.exports = {
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module',
		'ecmaFeatures': {
			'impliedStrict': true,
		},
	},
	'env': {
		'node': 0,
		'es2021': true,
		'browser': true,
	},
	'extends': [
		'eslint:recommended',
		'plugin:vue/vue3-recommended',
	],
	'plugins': [
		'vue',
	],
	'rules': {
		'comma-dangle': [
			'error',
			'always-multiline',
		],
		'indent': [
			'error',
			'tab',
		],
		'eol-last': [
			'error',
			'always',
		],
		'no-console': 0,
		'no-mixed-spaces-and-tabs': 1,
		'no-unused-labels': 1,
		'no-useless-escape': 1,
		'quotes': [
			'error',
			'single',
		],
		'semi': [
			'error',
			'always',
		],
		'vue/component-definition-name-casing': 0,
		'vue/html-indent': [
			'error', 'tab',
		],
		'vue/html-quotes': [ 'error', 'single' ],
		'vue/require-default-prop': 0,
	},
};
