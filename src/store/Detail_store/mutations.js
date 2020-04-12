export const mutations = {
  //置空
  emptyData(state) {
    state.productDetail = {};
    state.rules = [];
    state.count = 1;
    state.isCollect = false;
  },
  changeData(state,data){
    state[data.key] = data.value
  },
  processingData(state, data) {
    // 更新商品详情数据

    let titles = {
      tem: data.tem_desc,
      milk: data.milk_desc,
      sugar: data.sugar_desc,
      cream: data.cream_desc
    };

    for (let key in titles) {

      if (data[key] == '') {
        continue;
      }

      let o = {
        title: titles[key],
        rule: []
      };

      let ruleData = data[key].split('/');

      for (let i = 0; i < ruleData.length; i++) {
        let o1 = {
          text: ruleData[i],
          isActive: i == 0
        };

        o.rule.push(o1);

      }

      state.rules.push(o);

    }

    //商品描述
    state.desc = data.desc.split(/\n/);

    state.productDetail = data;
  },
  sumCount(state) {   
    state.count += 1;
  },
  subCount(state) {
    state.count -= 1;
    if (state.count <= 0) {
      state.count = 1;
    }
  },
}
