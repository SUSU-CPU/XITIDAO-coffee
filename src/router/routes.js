export const routes = [
  // 注册路由
  {
    path: '/sign',
    name: 'Sign',
    // 路由懒加载
    component: r => (require(['../views/Sign_in.vue'],r))
  },
  // 登录路由
  {
    path: '/login',
    name: 'Login',
    // 路由懒加载
    component: r => (require(['../views/Login.vue'],r))
  },
  // 一级导航路由
  {
    path: '/main',
    name: 'Main',
    // 路由懒加载
    component: r => (require(['../views/Main.vue'],r)),
    // 二级路由
    children:[
      {
        // 首页
        path: '/home',
        name: 'Home',
        // 路由懒加载
        component: r => (require(['../views/Main/Home.vue'],r))
      },
      {
        // 菜单
        path: '/menu',
        name: 'Menu',
        // 路由懒加载
        component: r => (require(['../views/Main/Menu.vue'],r))
      },
      {
        // 订单
        path: '/indent',
        name: 'Indent',
        // 路由懒加载
        component: r => (require(['../views/Main/Indent.vue'],r))
      },
      {
        // 购物车
        path: '/shopCart',
        name: 'ShopCart',
        // 路由懒加载
        component: r => (require(['../views/Main/ShopCart.vue'],r))
      },     
      {
        // 我的
        path: '/my',
        name: 'My',
        // 路由懒加载
        component: r => (require(['../views/Main/My.vue'],r))
      },
    ]

  },
  {
    // 商品详情路由
    path: '/detail/:pid',
    name: 'Detail',
    // 路由懒加载
    component: r => (require(['../views/Detail.vue'],r)),
  },
  {
    // 我的收藏路由
    path: '/mylike',
    name: 'MyLike',
    // 路由懒加载
    component: r => (require(['../views/myLike.vue'],r)),
  },
  {
    // 我的地址路由
    path: '/mylocation',
    name: 'MyLocation',
    // 路由懒加载
    component: r => (require(['../views/Mylocation.vue'],r)),
  },
  {
    // 添加地址路由
    path: '/addLocal',
    name: 'AddLocal',
    // 路由懒加载
    component: r => (require(['../views/AddLocation.vue'],r)),
  },
  {
    // 我的资料路由
    path: '/myData',
    name: 'MyData',
    // 路由懒加载
    component: r => (require(['../views/MyData.vue'],r)),
  },
  {
    // 提交订单路由
    path: '/submit',
    name: 'Submit',
    // 路由懒加载
    component: r => (require(['../views/SubmitOrder.vue'],r)),
  },
  {
    // 订单路由
    path: '/myIndent',
    name: 'MyIndent',
    // 路由懒加载
    component: r => (require(['../views/Main/Indent.vue'],r)),
  },
  {
    // 订单路由
    path: '/account',
    name: 'Account',
    // 路由懒加载
    component: r => (require(['../views/account.vue'],r)),
  },
  {
    // 订单路由
    path: '/password',
    name: 'Password',
    // 路由懒加载
    component: r => (require(['../views/Password.vue'],r)),
  },
  {
    // 找回密码
    path:"/findPass",
    name:"FindPass",
    // 路由懒加载
    component: r => (require(['../views/retrievePass.vue'],r)),
  },
  {
    // 找回密码
    path:"/email",
    name:"Email",
    // 路由懒加载
    component: r => (require(['../views/verifyEmail.vue'],r)),
  },
  {
    // 精品推荐路由
    path:"boutique",
    name:"Boutique",
    // 路由懒加载
    component: r => (require(['../views/recommendation.vue'],r)),
  },
  {
    path: '*',
    redirect: {
      name: 'Home'
    }
  }
]