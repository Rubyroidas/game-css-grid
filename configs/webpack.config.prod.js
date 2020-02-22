const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    devtool: false,
    performance: {
        hints: 'warning',
        maxAssetSize: 10000000,
        maxEntrypointSize: 25000000
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
    ],

    optimization: {
        minimize: false,
        /*minimizer: [new TerserPlugin({
            // prohibition of `<bundle_file_name.ext>.LICENSE.txt` file on the output
            extractComments: false,
        })],*/
    },
};
