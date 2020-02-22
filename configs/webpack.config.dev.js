const path = require('path');
// const webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-source-map',
    stats: {
        assets: false,
        colors: true,
        version: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        children: false,
        modules: false,
        moduleTrace: false,
        reasons: false,
        source: false,
        entrypoints: false,
        cached: false,
        cachedAssets: false
    },
    performance: {
        hints: false
    },

    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
    ],

    optimization: {
        minimize: true
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|ts)x?$/,
                include: [
                    path.resolve(__dirname, '..', 'src')
                ],
                loader: 'eslint-loader',
                options: {
                    quiet: true
                }
            }
        ],
    },
};
