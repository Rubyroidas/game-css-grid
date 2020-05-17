module.exports = {
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: false
        }]
    },
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ]
};
