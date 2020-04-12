# coffee_shop

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

```
配置项目文件
    1-创建vue项目
    2-导入vant框架
      npm i vant --save /-S        //安装vant
      npm i babel-plugin-import -D //按需引入
    3-配置，在babel.config.js目录下添加
        plugins: [
            ['import', {
              libraryName: 'vant',
              libraryDirectory: 'es',
              style: true
            }, 'vant']
          ]
    4-在main.js引入组件并全局注册组件
        // 导入vant组件
        import{
          Button
        }from 'vant'
    5-rem配置插件
          npm i postcss-pxtorem  lib-flexible --save-dev
    6-配置postCss
          postcss.config.js
          module.exports = {
            plugins: {
              'autoprefixer': {
                browsers: ['Android >= 4.0', 'iOS >= 8']
              },
              'postcss-pxtorem': {
                rootValue: 37.5,
                propList: ['*']
              }
            }
          }
    7-在mine.js导入'lib-flexible'
          import 'lib-flexible'

```
安装及配置axios
    1-安装ajax请求模块
        npm i  vue-axios axios --save
    2-导入vue-axios\axios模块
        import axios from 'axios'
        import VueAxios from 'vue-axios'
    3-注册vue-axios
        Vue.use(VueAxios,axios)
```
注册页面
  1-引入vant样式
  2-验证表单,抽离到Utils工具库
  3-注册成功发送注册请求
  4-请求成功跳转到登录页面

```
登录页面
  1-引入vant样式
  2-验证表单
  3-发送登录请求
  4-请求成功跳转到首页

```
一级路由Main(底部导航)
  1-引入样式
  2-配置二级路由
  3-实现二级路由跳转
  4-编写组件页面

```
  首页(Home)
    1-首页轮播
    2-首页导航列表
    现在下单(Indent)、咖啡钱包(Wallet)、送TA咖啡(Give)、优惠联盟(DisCount),精品推荐(Boutique)
    3-点击首页菜单栏，跳转路由

```
  菜单(Menu)
    1-页面布局
    2-根据商品数据生成商品数据
    3-添加页面滚动动画
    4-点击商品跳转到(Detail)

```
  商品详情(Detail)
    1-页面布局
    2-点击立即购买添加商品到购物车
    3-点击立即购买跳转到确认订单页面(ShopNow)
