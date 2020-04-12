export const state = {
    active: 0,
  // banner图
  banner:[], 
  // 商品分类
  type:[],
  start:0,
  num:6,
  allProduct:[],
  product:[],
  isFinished:false,
  menuLoaded:false,
  typeName:"",
  navPageData: [
    {
        name: "Home",
        title: "首页",
        badge: "",
        active: require('../../assets/bottom_nav/home_active.png'),
        inactive: require('../../assets/bottom_nav/home.png')
    },
    {
        name: "Menu",
        title: "菜单",
        badge: "",
        active: require('../../assets/bottom_nav/menu_active.png'),
        inactive: require('../../assets/bottom_nav/menu.png')
    },
    {
        name: "Indent",
        title: "订单",
        badge: "",
        active: require('../../assets/bottom_nav/dingdan_active.png'),
        inactive: require('../../assets/bottom_nav/dingdan.png')
    },
    {
        name: "ShopCart",
        title: "购物车",
        badge: "",
        active: require('../../assets/bottom_nav/shop_active.png'),
        inactive: require('../../assets/bottom_nav/shop.png')
    },
    {
        name: "My",
        title: "我的",
        badge: "",
        active: require('../../assets/bottom_nav/my_active.png'),
        inactive: require('../../assets/bottom_nav/my.png')
    }
]
}
