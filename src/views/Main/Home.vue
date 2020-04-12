<template>
  <div class="home">
    <!-- 轮播图 -->
    <div class="banner">
      <van-swipe :autoplay="3000" :indicator-color="'#893e23'" :height="150">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img class="auto-img images" v-lazy="image.bannerImg" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 首页列表 -->
    <div class="content">
      <div class="information">
        <div
          class="info-list clear"
          v-for="(item,index) in listData"
          :key="index"
          @click="cutRoute(item)"
        >
          <div class="fl">
            <p class="ch-handel">{{item.chName}}</p>
            <p class="en-handel">{{item.enName}}</p>
          </div>
          <div class="fr">
            <div class="icon">
              <img class="auto-img" :src="item.src" />
            </div>
          </div>
        </div>
        <div class="bottom_banner">
          <img class="auto-img" :src="require('../../assets/home/bottom_banner.jpg')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      
      listData: [
        {
          name: "Menu",
          chName: "现在下单",
          enName: "Shop Now",
          src: require("../../assets/home/home_list1.png")
        },
        {
          name: "Boutique",
          chName: "精品推荐",
          enName: "Boutique Recommend",
          src: require("../../assets/home/home_list5.png")
        }
      ]
    };
  },
  created(){
    this.getBanner()
    if(this.$route.name == "Home"){
        this.$store.commit("MainModule/changeData", {key:"active",value:0});
    }
  },
  computed:{
    images() {
                return this.$store.state.MainModule.banner;
            },
  },
  methods: {
    // 跳转路由
    cutRoute(item) {
      this.$router.push({ name: item.name });
    },
    getBanner() {
                this.axios({
                    method: "GET",
                    url: "/banner",
                    params: {
                        appkey: this.appkey
                    }
                })
                    .then(regest => {
                        if (regest.data.code == 300) {
                          
                            this.$store.commit(
                                "MainModule/changeData",
                                {key:"banner",value:regest.data.result}
                                
                            );
                        }
                    })
                    .catch(error => {
                        
                    });
            },
  }
};
</script>

<style lang="less" scoped>
.home {
  width:calc(100% - 20px);
  height: calc(100% - 50px);
  padding:40px 10px 10px;
  overflow-y: auto;
  .banner {
    border-radius: 15px;
    overflow: hidden;
    .my-swipe .van-swipe-item {
      color: #fff;
      font-size: 20px;
      line-height: 150px;
      text-align: center;
      background-color: #39a9ed;
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 237px);
    margin-top: 15px;
    .information {
      height: 100%;
    }
    .info-list {
      height: 67px;
      border-bottom: 1px solid #ddd;
      > div {
        height: calc(100% - 20px);
        padding: 10px;
      }
      p {
        height: 50%;
        line-height: 20px;
      }
      .ch-handel {
        font-size: 16px;
        color: #343333;
        font-weight: bold;
      }
      .en-handel {
        font-size: 14px;
        color: #5c5c5c;
      }
    }
    .info-list:last-child {
      border-bottom: none;
    }
    .icon {
      width: 25px;
      height: 25px;
      margin-top: 10px;
      padding: 5px;
      border: 1px solid #893e23;
      border-radius: 50%;
    }
    .bottom_banner {
      width:calc(100% - 20px);
      height: 67px;
      position:fixed;
      bottom:60px;
      > img {
        height: 100%;
        border-radius: 15px;
      }
    }
  }
}
</style>