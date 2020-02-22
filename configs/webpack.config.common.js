const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const devConfig = require('./webpack.config.dev');
const prodConfig = require('./webpack.config.prod');

module.exports = (_, baseConfig) => {
    const development = baseConfig.mode === 'development';
    const config = {
        entry: path.resolve(__dirname, '../src/index.ts'),
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts)x?$/,
                    exclude: [
                        /node_modules/,
                        /\.test.(js|ts)x?$/
                    ],
                    use: {
                        loader: 'babel-loader'
                    }
                },
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                DEVELOPMENT: String(development),
            }),
        ],
    };

    return merge(config, development ? devConfig : prodConfig);
};
