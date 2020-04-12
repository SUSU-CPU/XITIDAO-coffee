<template>
    <div class="login">
        <div class="logo">
            <img class="auto-img" :src="require('../assets/logo.png')" />
            <h1>XITIDAO</h1>
        </div>
        <van-form class="form" @submit="loginVerify">
            <van-field
                class="inp"
                type="text"
                name="手机号"
                label="手机号"
                v-model="userInfo.phone"
                placeholder="11位手机号"
                autocomplete="off"
            />
            <van-field
                class="inp"
                type="password"
                name="密码"
                label="密码"
                v-model="userInfo.password"
                placeholder="输入密码"
                autocomplete="off"
            />
            <div class="btn-box">
                <van-button
                    round
                    block
                    type="info"
                    native-type="submit"
                    class="button"
                >登&nbsp;&nbsp;&nbsp;陆</van-button>
            </div>

            <span class="toLogin sign fr" @click="goSign">注册账号</span>
            <span class="toLogin fr" @click="retrievePassWord">找回密码&nbsp;|</span>
        </van-form>
        
    </div>
</template>

<script>
    import vaild from "../Utils/valids";
    // 导入公共方法
    import { Utile } from "../Utils/Utilse";
    export default {
        name: "Login",
        computed: {
            // 用户名
            userInfo() {
                return this.$store.state.loginModule.userInfo;
            }
        },

        methods: {
            // 验证
            loginVerify() {
                let name = this.$route.query.name;
                
                if (vaild.validForm(this.userInfo, this)) {
                    this.$toast.loading({
                        message: "登录中...",
                        forbidClick: false
                    });
                    this.axios({
                        url: "/login",
                        method: "POST",
                        data: {
                            appkey: this.appkey,
                            password: this.userInfo.password,
                            phone: this.userInfo.phone
                        },
                        transformRequest: Utile.transformRequest
                    })
                        .then(regest => {
                            
                            this.$toast.clear();

                            // 登录成功后，将token保存在cokkiezhong
                            if (regest.data.code == 200) {
                                this.$store.commit("changeData", {
                                key: "isLogin",
                                value: true
                            });
                                this.$toast.clear();
                                // let tokenData = regest.data.token.split(".");
                                // cookie过期时间
                                // let expires = 30 * 24 * 60 * 60;
                                // tokenData.forEach((v, i) => {
                                //     // v:token分段
                                //     this.$cookies.set("t" + i, v, expires);
                                // });

                                // 存储token字符串到本地存储
                                localStorage.setItem("_t", regest.data.token);

                                if (name == 1) {
                                    this.$router.push({ name: "Menu" });
                                    
                                } else {
                                    this.$router.go(-1);
                                }
                            }
                            this.$toast(regest.data.msg);
                        })
                        .catch(error => {
                            this.$toast("出错了");
                        });
                }
            },
            // 跳转页面
            goSign() {
                this.$router.push({ name: "Sign" });
            },
            // 找回密码
            retrievePassWord() {
                this.$router.push({name:"Email"})
            }
        }
    };
</script>

<style lang="less" scoped>
    .login {
        height: calc(100% - 120px);
        padding: 70px 0 50px;
        .logo {
            width: 130px;
            margin: 0 auto;
            h1 {
                margin: 0;
                text-align: center;
                font-size: 30px;
                color: #f7c2c8;
            }
        }
    }
    .form {
        padding: 30px 50px;
        background: transparent;
        .active {
            border-bottom: 2px solid #e4393c;
        }
        .inp {
            border-bottom: 2px solid #dedad7;
            font-size: 15px;
            font-weight: bold;
            padding: 10px 15px;
            color: #797979;
            background: transparent;
        }
        .btn-box {
            margin-top: 55px;
            .button {
                display: block;
                width: 100%;
                height: 45px;
                border: 0;
                padding: 0;
                margin: 0;
                background: #f7a2ad;
                border-radius: 20px;
                font-size: 25px;
                font-weight: bold;
                color: #fff;
            }
        }
        .toLogin {
            display: inline-block;
            margin: 5px 0;
            color: #f7a2ad;
            text-align: right;
        }
        .sign {
            margin-left: 3px;
        }
    }
</style>