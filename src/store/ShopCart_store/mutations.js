export const mutations = {
  //置空数据
  emptyData(state) {
    state.isFinished = false;
    state.num = 10;
    state.start = 0;
    state.shopCar = [];
    state.allShopCar = [];
    state.isBatch = false;
    state.count = 0;
    // 多选框状态
    state.allCheck = false;
  },
  // 修改数据
  changeData(state, data) {
    state[data.key] = data.value
  },
  // 加载商品
  loadShopcartData(state) {
    state.shopCar.push(...state.allShopCar.slice(state.start, state.num + state.start))
    state.start = state.num;
  },
  // 单选事件
  check(state, index) {
    if (index != undefined) {
      state.shopCar[index].isChecked = !state.shopCar[index].isChecked;
    }

    for (let i = 0; i < state.shopCar.length; i++) {
      // 有一个没勾选就return
      if (!state.shopCar[i].isChecked) {
        state.allCheck = false;
        return;
      }
      state.allCheck = true;
    }



  },
  // 多选
  allChecked(state) {
    state.allCheck = !state.allCheck
    state.shopCar.forEach(v => {
      v.isChecked = state.allCheck;
    })
  },
  //删除shopcartData数组的元素
  removeShopcartData(state, data) {

    for (let i = state.shopCar.length - 1; i >= 0; i--) {
      if (data.indexOf(state.shopCar[i].sid) > -1) {
        state.shopCar.splice(i, 1);
      }
    }

    
  },
  // 商品总价格
  allPrice(state) {
    state.allPrice = 0;
    state.shopCar.forEach(v => {

      if (v.isChecked) {
        state.allPrice += v.price * 100 * v.count;
      }
    });
  },
  // 计算商品数量
  priceCount(state) {
    state.count = 0;
    state.shopCar.forEach(v => {
      state.count += v.count
    })
  }


}
