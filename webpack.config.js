const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/client.js",
  output: {
    path: path.resolve(__dirname, "public/static/js"),
    filename: "bundle.js",
  },
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
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
