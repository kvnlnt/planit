var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var rimraf = require('rimraf');
var path = require('path');
var cssnext = require('cssnext');
var autoprefixer = require('autoprefixer');
var customMedia = require("postcss-custom-media");

module.exports = {

    entry: {
        app: [
            "webpack/hot/only-dev-server",
            "./src/main.js"
        ]
    },

    devtool: 'source-map',

    devServer: {
        contentBase: "./dev/",
        inline: true,
        hot: true
    },

    output: {
        path: "./dev",
        filename: "[name].[hash].bundle.js"
    },

    externals: {
        // don't include React in the bundle. Use a CDN for this.
        'react': 'React'
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({
            title: 'Custom template',
            template: 'src/index.html',
            inject: 'body'
        }),
        function() {
            if (process.env.NODE_ENV === 'production') rimraf.sync('./dist/');
        }
    ],

    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            include: path.join(__dirname, 'src')
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader!postcss-loader!cssnext-loader",
            include: path.join(__dirname, 'src')
        }]
    },

    cssnext: {
        browsers: "last 2 versions",
    },

    postcss: function() {
        return [customMedia(), cssnext, autoprefixer];
    }

};