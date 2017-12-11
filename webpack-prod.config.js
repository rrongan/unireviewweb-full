var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var MinifyPlugin = require("babel-minify-webpack-plugin");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	devtool: 'none',
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new ExtractTextPlugin("[name]-[hash].css"),
		new MinifyPlugin(),
		new HtmlWebpackPlugin({ inject: 'head',
			template: __dirname + "/public/index.tmpl.html"}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			skel: "skel-framework-npm"
		})
	],
	entry: [
		'./public/javascripts/angularApp'
	],
	target: 'web',
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/',
		filename: "[name]-[hash].js"
	},
	module: {
		rules: [
			{ test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"},
			{ test: /\.css$/, loaders: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })},
			{test: /\.(svg|png|jpe?g|gif)(\?\S*)?$/, loader: 'file-loader'},
			{test: /\.(eot|woff|woff2|ttf)(\?\S*)?$/, loader: 'file-loader'}
		]
	}
};