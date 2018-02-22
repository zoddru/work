var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    devtool: debug ? 'inline-sourcemap' : false,
    entry: {
        teachers: './src/Teachers/app.js',
        dataMaturity: './src/DataMaturity/app.js',
        authentication: './src/Authentication/app.js'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|browser_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-3'],
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
                }
            }
        ]
    },
    output: {        
        filename: '[name].min.js',
        path: __dirname + '/docs/js/',
        publicPath: '/js/'
    },
    plugins: debug ? [] : [
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
};