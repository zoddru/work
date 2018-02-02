var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    devtool: debug ? 'inline-sourcemap' : false,
    entry: './js/scripts.js',
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|browser_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
                }
            }
        ]
    },
    output: {        
        filename: 'scripts.min.js',
        path: __dirname + '/docs/js/',
        publicPath: '/js/'
    },
    plugins: debug ? [] : [
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
};