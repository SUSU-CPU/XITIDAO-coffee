<template>
    <div class="my-location">
        <div class="local-nav">
            <van-nav-bar title="我的地址" left-text="返回" left-arrow @click-left="onClickLeft" />
        </div>
        <div class="location">
            <div class="local-top">
                <!-- <div class="local"> -->
                <van-address-list
                    v-model="chosenAddressId"
                    :list="locationData"
                    default-tag-text="默认"
                    @add="goAddLocal"
                    @edit="onEdit"
                    :switchable = "false"
                />
                <!-- </div> -->
                <div class="noLocal" v-show="isShow">
                    <span>您还没有地址信息~~~</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Utile } from "../Utils/Utilse";
    import { mapState } from "vuex";
    export default {
        name: "MyLocation",
        data() {
            return {
                chosenAddressId:"0",
            };
        },
        computed: {
            ...mapState("LocationModule", ["isShow", "locationData"])
        },
        created() {
            let tokenString = localStorage.getItem("_t");

            //加载提示
            this.$toast.loading({
                forbidClick: true,
                duration: 0,
                message: "加载中..."
            });
            if (this.locationData.length <= 0) {
                this.$store.commit("LocationModule/changeData", {
                    key: "isShow",
                    value: false
                });
            }
            this.axios({
                method: "GET",
                url: "/findAddress",
                params: {
                    appkey: this.appkey,
                    tokenString
                }
            }).then(result=>{
                
                if(result.data.code == 20000){
                    result.data.result.forEach((v,i)=>{
                        v.address = v.province + v.city + v.addressDetail
                        v.isDefault = Boolean(v.isDefault)
                        v.id = `${i}`;
                        if(v.isDefault){
                            this.chosenAddressId = v.id
                        }
                    }) 
                    
                    this.$store.commit('LocationModule/changeData',{key:"locationData",value:result.data.result})
                }
                this.$toast.clear()
            }).catch(()=>{
                
                this.$toast.clear()
            });
        },
        methods: {
            onEdit(item, index) {
                this.$router.push({name:"AddLocal",query: { isAdd: 0, aid:item.aid}})
            },
            onClickLeft() {
                this.$router.go(-1);
            },
            // 跳转到添加地址栏
            goAddLocal() {
                this.$router.push({ name: "AddLocal", query: { isAdd: 1 } });
            }
        }
    };
</script>

<style lang="less" scoped>
    .my-location {
        width: calc(100% - 20px);
        height: calc(100% - 30px);
        padding:20px 10px 10px;
        > div {
            border-radius: 10px;
            overflow: hidden;
        }
        /deep/.van-nav-bar .van-icon,
        /deep/.van-nav-bar__text{
            color: #ff7f8c;
        }
        .location {
            width: 100%;
            height: calc(100% - 56px);
            margin-top: 10px;
            background: #fff;
            position: relative;

            .local-bottom {
                width: calc(100% - 20px);
                padding: 5px 10px;
                position: absolute;
                bottom: 0;
                .van-button {
                    height: 45px;
                    border-radius: 25px;
                }
            }
            .local-top {
                height: calc(100% - 55px);
                overflow: hidden;
                .noLocal {
                    text-align: center;
                    line-height: 591px;
                }
                .van-tag--danger {
                    background: #ff7f8c;
                }
                /deep/ .van-address-item .van-radio__icon--checked .van-icon {
                    background: #ff7f8c;
                    border-color: #ff7f8c;
                }
                /deep/ .van-button--danger {
                    background: #ff7f8c;
                    border-color: #ff7f8c;
                }
            }
        }
    }
</style>