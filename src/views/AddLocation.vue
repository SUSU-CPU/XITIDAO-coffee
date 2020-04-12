<template>
    <div class="add-location">
        <van-nav-bar
            class="nav"
            :border="false"
            :title="title"
            left-arrow
            @click-left="onClickLeft"
        />

        <van-address-edit
            :area-list="localData"
            :address-info="addressInfo"
            :show-set-default="isDefault"
            :show-delete="isDelete"
            :show-postal="isPostal"
            save-button-text="保存地址"
            delete-button-text="删除地址"
            detail-rows="2"
            detail-maxlength="50"
            @delete="deleteAddress"
            @save="saveAddress"
            active-color="#07c160"
            inactive-color="#ee0a24"
        />
    </div>
</template>

<script>
    import { mapState } from "vuex";
    import { Utile } from "../Utils/Utilse";
    export default {
        name: "AddLocation",
        data() {
            return {
                //初始化组件地址内容，编辑地址需要用到
                addressInfo: {
                    aid: "",
                    name: "",
                    tel: "",
                    province: "",
                    city: "",
                    county: "",
                    addressDetail: "",
                    areaCode: "",
                    postalCode: "",
                    isDefault: false
                }
            };
        },
        computed: {
            ...mapState("LocationModule", [
                "isDefault",
                "isDelete",
                "isPostal",
                "localData",
                "isAdd",
                "aid",
                "title",
                "temporaryAddressData"
            ])
        },
        created() {
            // 截取参数
            let query = this.$route.query;
            let tokenString = localStorage.getItem("_t");

            
            if (query.isAdd == 0) {
                this.axios({
                    url: "/findAddressByAid",
                    method: "GET",
                    params: {
                        tokenString,
                        appkey: this.appkey,
                        aid: query.aid
                    }
                })
                    .then(result => {
                        
                        if (result.data.code == 40000) {
                            let data = result.data.result[0];
                            data.isDefault = Boolean(data.isDefault);

                            for (let key in this.addressInfo) {
                                this.addressInfo[key] = data[key];
                            }
                            let addressData = Object.assign({}, this.addressInfo);
                            this.$store.commit("LocationModule/changeData", {
                                key: "temporaryAddressData",
                                value: addressData
                            });
                        }
                    })
                    .catch(() => {
                        
                    });
            }
            this.$store.commit("LocationModule/changeData", {
                key: "aid",
                value: query.aid
            });
            this.$store.commit("LocationModule/changeData", {
                key: "isAdd",
                value: query.isAdd
            });
            this.$store.commit("LocationModule/changeData", {
                key: "isDelete",
                value: query.isAdd == "0" ? true : false
            });
            this.$store.commit("LocationModule/changeData", {
                key: "title",
                value: query.isAdd == "0" ? "编辑地址" : "新增地址"
            });
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1);
            },
            // 封装查询地址是否一样函数
            isSame(o1, o2) {
                for (let key in o1) {
                    if (o1[key] != o2[key]) {
                        return false;
                    }
                }
                return true;
            },
            //保存地址
            saveAddress(addressContent) {
                // 拷贝对象
                let data = Object.assign({}, addressContent);
                // tokenString
                let tokenString = localStorage.getItem("_t");
                data.tokenString = tokenString;
                data.appkey = this.appkey;
                // 将isDefule转换为数值
                data.isDefault = Number(data.isDefault);

                delete addressContent.country;
                let url = "";
                if (this.isAdd == 1) {
                    // 新增地址
                    url = "/addAddress";
                    delete data.aid;
                } else {
                    // 编辑地址
                    
                    if (this.isSame(addressContent, this.temporaryAddressData)) {
                        
                        return this.$router.go(-1);
                    } else {
                        url = "/editAddress";
                        
                    }
                }
                this.axios({
                    method: "POST",
                    url,
                    data,
                    transformRequest: Utile.transformRequest
                })
                    .then(result => {
                        
                        if (result.data.code == 9000 || result.data.code == 30000) {
                            this.$router.go(-1);
                        }
                    })
                    .catch(() => {
                        
                    });
            },
            // 删除地址
            deleteAddress(item) {
                let tokenString = localStorage.getItem("_t");

                
                this.axios({
                    url: "/deleteAddress",
                    method: "POST",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        aid: this.aid
                    },
                    transformRequest: Utile.transformRequest
                })
                    .then(result => {
                        
                        if (result.data.code == 10000) {
                            this.$router.go(-1);
                        }
                    })
                    .catch(() => {
                        
                    });
            }
        }
    };
</script>

<style lang="less" scoped>
    .add-location {
        width:calc(100% - 20px);
        height: calc(100% - 30px);
        padding:20px 10px 10px;
        /deep/.van-nav-bar .van-icon {
            color: #ff7f8c;
        }
        .nav {
            background: transparent;
        }
        .van-address-edit {
            height: calc(100% - 70px);
        }
        /deep/.van-address-edit__buttons {
            width: calc(100% - 44px);
            position: fixed;
            bottom: 0;
        }
        /deep/.van-button--danger {
            background: #ff7f8c;
            border: 1px solid #ff7f8c;
        }
        /deep/.van-switch--on {
            background: #ff7f8c;
        }
    }
</style>