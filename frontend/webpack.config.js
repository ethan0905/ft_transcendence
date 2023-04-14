// const path = require('path');

// module.exports = {
//   // ... other configuration options ...
//   resolve: {
//     fallback: {
//       "os": require.resolve("os-browserify/browser")
//     }
//   }
// };

const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    fallback: {
      "os": require.resolve("os-browserify/browser"),
    },
  },
  plugins: [
    new Dotenv(),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
  },
};