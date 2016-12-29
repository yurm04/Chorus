var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
	template: __dirname + '/app/index.html',
	filename: '../index.html',
	inject: 'body'
});

module.exports = {
	entry: [
		'./app/index.js'
	],

	output: {
		path: __dirname + '/public/js',
		filename: 'bundle.js'
	},

	module: {
		loaders: [
			{test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract(
					'style', // The backup style loader
					'css?sourceMap!sass?sourceMap'
				)
			}
		]
	},

	plugins: [
		HtmlWebpackPluginConfig,
		new ExtractTextPlugin('../css/styles.css')
	],

	sassLoader: {
		includePaths: ['app/scss']
	},

	devtool: 'source-map'
}