const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    mode: 'development',
    entry: __dirname + "/src/main.ts",
    output:{
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules:[
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader'
                },
                exclude: /node_modules/
            }
        ]
    }
}