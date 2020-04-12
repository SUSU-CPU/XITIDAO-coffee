export const mutations = {
  changeData(state,data){
    state[data.key] = data.value
  },
  emptyData(state){
    state.allIndentList = [];
    state.IndentList = [];
  }
}