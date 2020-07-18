module.exports = {
  entry: './client',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: []
        }
      }
    ]
  }
};
