module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    globals: {
        // GNOME Shell globals
        'imports': 'readonly',
        'global': 'readonly',
        'log': 'readonly',
        'logError': 'readonly',
        'print': 'readonly',
        'printerr': 'readonly',
        // GJS/GObject globals - these are imported, not global
        // Test globals
        'expect': 'readonly',
        'test': 'readonly',
        'describe': 'readonly',
        'beforeEach': 'readonly',
        'afterEach': 'readonly',
        'beforeAll': 'readonly',
        'afterAll': 'readonly',
        'jest': 'readonly'
    },
    rules: {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
        'no-console': 'off',
        'no-undef': 'error',
        'no-trailing-spaces': 'error',
        'eol-last': 'error',
        'comma-dangle': ['error', 'never'],
        'brace-style': ['error', '1tbs'],
        'keyword-spacing': 'error',
        'space-before-blocks': 'error',
        'space-infix-ops': 'error'
    }
}; 