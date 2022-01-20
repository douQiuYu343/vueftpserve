module.exports = {
    devServer: {
        proxy: {
            '/api/*': {
                target: 'http://127.0.0.1:25564',
                ws: true,
                changeOrigin: true,
                pathRewrite:{
                    '^/api': ''
                },
            },
        }
    }
}