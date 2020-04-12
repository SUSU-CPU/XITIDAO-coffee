<template>
  <div id="app">
    <!-- 一级路由入口 -->
    <router-view></router-view>
  </div>
</template>

<style lang="less">
body,html{
  height:100%;
  margin:0;
  background: #ffffff;
}
#app{
  height:100%;
}
ul{
  list-style:none;
  margin:0;
  padding:0;
}
.auto-img{
  width:100%;
  display: block;
}
.fl{
  float:left;
}
.fr{
  float:right;
}
.clear::after{
  content:'';
  clear: both;
  display: block;
}
p{
  margin:0;
}
</style>
