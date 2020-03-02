const path = require('path');

const sourceDirectory = path.resolve( __dirname, 'src' );
const buildDir = path.resolve( __dirname, 'dist' );

module.exports = {
    context: sourceDirectory,
    entry: {
        'main': './main.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: buildDir
    },
    devtool: 'cheap-module-source-map',
    devServer: {},
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            sourceDirectory,
            'node_modules'
        ]
    },
    module: {
        rules: [{
            enforce: 'pre',
            test: /\.js$/,
            use: 'source-map-loader'
        }, {
            test: /\.ts$/,
            exclude: [ /node_modules/ ],
            use: 'awesome-typescript-loader'
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: ['file-loader'],
        }]
    },
};
