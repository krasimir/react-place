var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var path = require('path');

var host = '0.0.0.0';
var port = '9000';

var config = {
  entry: './example-es6/src',
  devtool: 'source-map',
  output: {
    path: __dirname + '/example-es6/build',
    filename: 'app.js',
    publicPath: __dirname + '/example-es6'
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js', '.jsx']
  }
};

new WebpackDevServer(webpack(config), {
  contentBase: './example-es6',
  hot: true,
  debug: true
}).listen(port, host, function (err, result) {
  if (err) {
    console.log(err);
  }
});
console.log('-------------------------');
console.log('Local web server runs at http://' + host + ':' + port);
console.log('-------------------------');

module.exports = config;
