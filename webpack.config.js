var path = require('path');
var webpack = require('webpack');

module.exports = {
	devtool: 'source-map',
	plugins: [
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
		path: path.join(__dirname, 'build'),
		publicPath: 'http://localhost:3000',
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{ test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"}
		]
	}
};