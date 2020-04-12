import Vue from 'vue'
import Vuex from 'vuex'

import {signModule} from './Sign_store/modules'

import {loginModule} from './Login_store/modules'

import {MainModule} from './Main_store/modules'

import {ShopModule} from './ShopCart_store/module'

import {DetailModule} from './Detail_store/module'

import {LikeModule} from './MyLike_store/module'

import {MyModule} from './My_store/module'

import {LocationModule} from './MyLocation_store/module'

import {SubmitModule} from './Submit_store/module'

import {OrderModule} from './Indent_store/module'

import {BoutiqueModule} from './Boutique_store/module'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    // 菜单页面是否已经加载过
    menuIsLoaded: false,
    isLogin:false
  },
  mutations:{
    changeData(state, data) {
      state[data.key] = data.value;
    }
  },
  modules: {
    // 登录
    loginModule,
    // 注册
    signModule, 
    // 底部导航
    MainModule,
    // 购物车模块
    ShopModule,
    // 商品详情模块
    DetailModule,
    // 收藏商品模块
    LikeModule,
    // 我的页面模块
    MyModule,
    // 地址管理模板
    LocationModule,
    // 提交订单
    SubmitModule,
    // 订单列表模块
    OrderModule,
    BoutiqueModule
  }
})

