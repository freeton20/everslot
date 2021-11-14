const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: 'development',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html"
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new webpack.ProvidePlugin({
            '$': 'jquery',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/contracts/ContractData.json"),
                    to: path.resolve(__dirname, "dist/contracts/ContractData.json")
                },
                {
                    from: path.resolve(__dirname, "node_modules/@tonclient/lib-web/tonclient.wasm"),
                    to: path.resolve(__dirname, "dist/tonclient.wasm")
                }
            ]
        })
    ],
    devServer: {
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ],
        minimize: true
    },
    target: "web",
    externals: {
        fs: "commonjs fs",
        path: "commonjs path"
    }
}