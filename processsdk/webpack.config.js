const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const uglifyjs = require('uglifyjs-webpack-plugin');

var path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
	mode: "production",
	// entry: {
	//   sdk: './src/index.js',
	//   test: './script/index.js'
	// },
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
		// libraryTarget: 'var',
		library: "process",
	},
	devtool: 'source-map',
	devServer: {
		port: 8090,
		open: true,
		hot: true,
		
	},
	resolve: {
		alias: {
			"@": resolve("./src"),
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: ["babel-loader", "eslint-loader"],
				exclude: /node_modules/,
			},
			{
				// 用正则匹配当前访问的文件的后缀名是  .css
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"], // webpack底层调用这些包的顺序是从右到左
			},
			{
				test: /\.(png|jpg|gif)/,
				use: [
					{
						loader: "url-loader",
						options: {
							// limit表示如果图片大于5KB，就以路径形式展示，小于的话就用base64格式展示
							limit: 5 * 1024,
							// 打包输出目录
							outputPath: "images",
							// 打包输出图片名称
							name: "[name]-[hash:4].[ext]",
						},
					},
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
		  filename: 'index.html',
		  template: './index.html'
		}),
		new CleanWebpackPlugin(),
		new uglifyjs(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.join(__dirname, "./static/"),
					to: "static/",
				},
			],
		}),
	],
};
