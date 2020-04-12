import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入vue-axios\axios模块
import axios from 'axios'
import VueAxios from 'vue-axios'

// 导入cookies模板
import VueCookies from 'vue-cookies'

// rem
import 'lib-flexible'

// 导入vant组件
import {
  Form,
  Field,
  Button,
  Dialog,
  Toast,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Lazyload,
  Divider,
  Tag,
  Icon,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  List,
  SwipeCell,
  NavBar,
  AddressEdit,
  AddressList,
  ActionSheet,
  Popup,
  Switch,
  Cell,
  Tab,
  Tabs,
  Uploader,
  Empty,
  Grid, 
  GridItem,
  Image
} from 'vant'


// 注册组件
Vue.use(Button)
  .use(Field)
  .use(Form)
  .use(Dialog)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Divider)
  .use(Tag)
  .use(Icon)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SubmitBar)
  .use(List)
  .use(SwipeCell)
  .use(NavBar)
  .use(AddressEdit)
  .use(AddressList)
  .use(ActionSheet)
  .use(Popup)
  .use(Switch)
  .use(Cell)
  .use(Tab)
  .use(Tabs)
  .use(Uploader)
  .use(Empty)
  .use(Grid)
  .use(GridItem)
  .use(Image)

// 注册vue-axios/axios
Vue.use(VueAxios, axios)

// 注册cookie
Vue.use(VueCookies)

Vue.config.productionTip = false

// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

// 设置基础请求路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

// 为vue原型添加一个属性
// 1my-U2FsdGVkX187hjBtMe8gMWs5J3SuLc9apD5H2igVjvE=
// 2-U2FsdGVkX1/5U8OuiHxu0D25jTsSGVIw5z4yEStqLcY=
// 3-U2FsdGVkX18SdVFBDQvHgwH1LhB8qtICC1X+E84OSVE=
Vue.prototype.appkey = 'U2FsdGVkX1/5U8OuiHxu0D25jTsSGVIw5z4yEStqLcY='



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
