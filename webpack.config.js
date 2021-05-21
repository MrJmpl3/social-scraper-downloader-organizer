/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "development",
  target: "node",
  entry: {
    // facebook: "./src/facebook.ts",
    facebookMobile: "./src/facebookMobile.ts",
    instagram: "./src/instagram.ts",
    tiktok: "./src/tiktok.ts",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(process.cwd(), "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "tsconfig.json"),
      }),
    ],
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()],
  plugins: [new CleanWebpackPlugin()],
};
