var path = require('path'),
assets_path = path.join('app', 'assets', 'javascripts');

var config = {
  context: path.resolve(assets_path),
  entry: './entry.js.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(assets_path)
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.resolve(assets_path)
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel' }
    ]
  }
};

module.exports = config;
