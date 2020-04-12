<template>
    <div class="find-password">
        <van-nav-bar title="找回密码" left-text="上一步" left-arrow @click-left="onClickLeft" />
        <van-form class="form" @submit="loginVerify">
            <van-field
                class="inp"
                type="text"
                name="手机号"
                label="手机号"
                v-model="userInfo.phone"
                placeholder="输入手机号"
                autocomplete="off"
            />
            <van-field
                class="inp"
                type="text"
                name="密码"
                label="密码"
                v-model="userInfo.password"
                placeholder="输入6-16位含大写字母的密码"
                autocomplete="off"
            />
            <div class="btn-box">
                <van-button
                    round
                    block
                    type="info"
                    native-type="submit"
                    class="button"
                >提&nbsp;&nbsp;交</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
    import vaild from "../Utils/valids";
    import { Utile } from "../Utils/Utilse";
    export default {
        name: "FindPass",
        data() {
            return {
                userInfo: {
                    phone: "",
                    password: ""
                }
            };
        },
        methods: {
            // 上一步
            onClickLeft() {
                this.$router.push({
                    name: "Email"
                });
            },
            // 提交
            loginVerify() {
                if (vaild.validForm(this.userInfo, this)) {
                    
                    this.axios({
                        url: "/retrievePassword",
                        method: "POST",
                        data: {
                            appkey: this.appkey,
                            phone: this.userInfo.phone,
                            password: this.userInfo.password
                        },
                        transformRequest: Utile.transformRequest
                    })
                        .then(request => {
                            
                            this.$toast(request.data.msg);
                            if (request.data.code == "L001") {
                            this.$router.push({ name: "Login",query:{name:1}});
                            }
                        })
                        .catch(() => {
                            
                        });
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    @color: #f7a2ad;
    .van-nav-bar__text,
    .van-nav-bar .van-icon {
        color: @color;
    }
    .find-password {
        width: calc(100% - 20px);
        height: calc(100% - 30px);
        padding:20px 10px 10px;
        .form {
            border-radius: 10px;
            overflow: hidden;
            padding: 30% 0;
        }
        .btn-box {
            margin-top: 40px;
        }
        .van-nav-bar {
            position: fixed;
            top: 20px;
            left: 0;
            right: 0;
        }
        .van-nav-bar__text,
        .van-nav-bar .van-icon {
            color: @color;
        }
        .van-button--info {
            background-color: @color;
            border-color: @color;
            font-size: 18px;
        }
        .van-field {
            padding: 13px 20px;
            border-radius: 5px;
        }
    }
</style>