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
            './eslint/strict',
            './eslint/compat',
            './eslint/imports',
            './eslint/es6',
            './eslint/best-practices',
            './eslint/errors',
            './eslint/variables',
            './eslint/style',
            './eslint/typescript',
        ].map(require.resolve),
    ],
};
