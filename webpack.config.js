const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
    }),
    new webpack.EnvironmentPlugin({
      STATE: process.env.STATE,
      CONCURRENT_MODE: process.env.CONCURRENT_MODE,
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        resolve: {
          fullySpecified: false,
        },
        exclude: /node_modules\/(?!(@apollo)\/).*/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { modules: false }],
                "@babel/preset-react",
              ],
            },
          },
        ],
      },
    ],
  },
  devServer: {
    port: process.env.PORT || "8080",
    historyApiFallback: true,
  },
};
