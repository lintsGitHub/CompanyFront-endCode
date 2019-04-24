module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://localhost:58561/',
                changeOrigin:true,
                pathRewrite:{	
                    '/api':'http://localhost:58561/'
                }
            },
// 			'/vip':{
// 			    target:'http://localhost:56404/',
// 			    changeOrigin:true,
// 			    pathRewrite:{	
// 			        '/vip':'http://localhost:56404/'
// 			    }
// 			},
            '/ms':{
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            }
        }
    }
}