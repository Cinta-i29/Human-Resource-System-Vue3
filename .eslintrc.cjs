/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-prettier/skip-formatting'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        'prettier/prettier': [
            'warn',
            {
                singleQuote: false,
                semi: true,
                printWidth: 100,
                trailingComma: 'all',
                tabWidth: 4,
                endOfLine: 'auto'
            }
        ],
        'vue/multi-word-component-names': [
            'warn',
            {
                ignores: ['index']
            }
        ],
        'vue/no-setup-props-destructure': ['off'],
        'no-undef': 'error'
    },
    globals: {
        ElMessage: 'readonly',
        ElMessageBox: 'readonly',
        ElLoading: 'readonly'
    }
} 