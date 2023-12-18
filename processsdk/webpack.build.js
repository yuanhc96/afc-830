const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const uglifyjs = require('uglifyjs-webpack-plugin');
const webpack = require('webpack')
var path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
	mode: "production",
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
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
			  use: {
			    loader: 'babel-loader'
			  },
			  exclude: /node_modules/
			},
			{
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
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.join(__dirname, "./static/"),
					to: "dist/",
				},
			],
		}),
    new uglifyjs(),
    new webpack.optimize.UglifyJsPlugin({
      //删除注释
      output:{
          comments:false
      },
      //删除console 和 debugger  删除警告
      compress:{
          warnings:false,
          drop_debugger:true,
          drop_console:true
      }
  })
	],
};
