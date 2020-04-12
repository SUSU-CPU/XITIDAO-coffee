export const mutations = {
  // 添加数据
  addLikeProduct(state,data){
    state.allLikeProduct = data
    
  },
  // 置空数据
  emptyData(state){
    state.isFinished = false;
    state.num = 6;
    state.start = 0;
    state.likeProduct=[];
    state.isShow=false;
    state.allLikeProduct=[];
  },
  // 取消收藏
  deleteLike(state,index){
    
    state.likeProduct.splice(index,1)
    if(state.likeProduct.length <= 0){
      state.isShow = true
      
    }
  },
   // 加载商品
   loadShopcartData(state,data) {
    state.likeProduct.push(...state.allLikeProduct.slice(state.start, state.num + state.start))
    state.start = state.num;
  },
  changeData(state,data){
    state[data.key] = data.value
  }

}