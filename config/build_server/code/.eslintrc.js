module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
		'jest': true,
		'node': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:security/recommended',
		'plugin:sonarjs/recommended',
		'plugin:xss/recommended',
		'plugin:no-unsanitized/DOM'
	],
	'overrides': [
	],
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'plugins': [
	],
	'rules': {
		'indent': [
			'error',
			'tab',
			{
				'SwitchCase': 1
			}
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'no-trailing-spaces': ['error'],
		'no-unused-vars': ['warn'],
		'no-multi-spaces': ['warn']
	}
};
