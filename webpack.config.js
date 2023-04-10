// const path = require.resolve('path');
// const util = require.resolve('util');
const webpack = require('webpack')
module.exports = {
    // ...
    resolve: {
        fallback: {
            "fs": false
        },
        // alias: {
        //     'polyfill-library': 'polyfill-library/dist/polyfill.min.js'
        // },
        // fallback: {
        //     process: require.resolve('process/browser'),
        // }
    },
    plugins: [
        // new webpack.DefinePlugin({ // webpack自带该插件，无需单独安装
        //     'process.env' : {
        //         NODE_ENV: process.env.NODE_ENV // 将属性转化为全局变量，让代码中可以正常访问
        //     }
        // }),
        new webpack.ProvidePlugin({
            // process: require.resolve('process/browser')
            process: 'process/browser'
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        })
    ]
    // ...
};
