export const mutations = {
  emptyData(state) {
    state.allProduct = [];
    state.product = [];
    state.start = 0;
    state.num = 6;
    state.isFinished = false;
  },
  // 设置banner
  setBanner(state, data) {
    state.banner = data;
  },
  setType(state, typeDate) {
    state.type = typeDate;
  },
  changeData(state, data) {
    state[data.key] = data.value;
  },
  // 构建新的商品数据结构
  creatProduct(state, data) {
    state.allProduct = data
  },
  // 改变购物车商品数量
  changeShopCount(state, count) {
    state.navPageData.forEach(v => {
      if (v.name == 'ShopCart') {
        v.badge = count
      }
    })
  },
  getShopCount(state, data) {

    data.self.axios({
        url: "/shopcartCount",
        method: "GET",
        params: {
          tokenString: data.tokenString,
          appkey: data.self.appkey
        }
      })
      .then(result => {
        if (result.data.code == 4000) {
          let count =
            result.data.result > 99 ?
            "99+" :
            result.data.result;
          data.self.$store.commit("MainModule/changeShopCount", count);
        }
      })
      .catch(error => {
        
      });

  },
  // 加载商品
  loadShopcartData(state, data) {
    state.product.push(...state.allProduct.slice(state.start, state.num + state.start))
    state.start = state.num;
  },
}
