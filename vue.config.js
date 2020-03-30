module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                assets: '@/assets',
                common: '@/common',
                components: '@/components',
                netwrok: '@/netwrok',
                views: '@/views'
            }
        }
    },
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            title: '易BUY商城'
        }
    }
}