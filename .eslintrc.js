module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    parserOptions: {
        project: './tsconfig.json',
    },
    globals: {
        DEVELOPMENT: true,
    },
    extends: [
        ...[
            './configs/eslint/strict',
            './configs/eslint/compat',
            './configs/eslint/imports',
            './configs/eslint/es6',
            './configs/eslint/best-practices',
            './configs/eslint/errors',
            './configs/eslint/variables',
            './configs/eslint/style',
            './configs/eslint/typescript',
        ].map(require.resolve),
    ],
};
