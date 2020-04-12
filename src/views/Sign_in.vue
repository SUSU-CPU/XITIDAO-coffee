<template>
    <!-- 注册界面 -->
    <div class="sign">
        <div class="logo">
            <img class="auto-img" :src="require('../assets/logo.png')" />
            <h1>XITIDAO</h1>
        </div>
        <van-form class="form" @submit="verify">
            <van-field
                class="inp"
                name="用户名"
                label="用户名"
                v-model="userInfo.userName"
                placeholder="1~8位字符"
                autocomplete="off"
            />
            <van-field class="inp" name="性别" label="性别" v-model="userInfo.sex" placeholder="男/女" />
            <van-field
                class="inp"
                type="text"
                name="出生日期"
                label="出生日期"
                v-model="userInfo.birthDate"
                placeholder="1999-1-1"
                autocomplete="off"
            />
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
                type="text"
                name="密码"
                label="密码"
                v-model="userInfo.password"
                placeholder="1~6位含大写字母"
                autocomplete="off"
            />
            <div class="btn-box">
                <van-button
                    round
                    block
                    type="info"
                    native-type="submit"
                    class="button"
                >注&nbsp;&nbsp;&nbsp;册</van-button>
            </div>
            <p class="toLogin" @click="goLogin">已注册,去登陆</p>
        </van-form>

        <van-dialog
            v-model="testShow"
            :title="testTitle"
            @cancel="closeAlert"
            @confirm="goLogin"
            show-cancel-button
        ></van-dialog>
    </div>
</template>

<script>
    import vaild from "../Utils/valids";
    // 导入公共方法
    import { Utile } from "../Utils/Utilse";
    export default {
        name: "Sign",
        data() {
            return {
                testShow: false,
                testTitle: ""
            };
        },
        computed: {
            // 用户名
            userInfo() {
                return this.$store.state.signModule.userInfo;
            }
        },
        methods: {
            // 关闭弹窗
            closeAlert() {
                return this.$store.commit("signModule/closeAlert");
            },
            // 验证
            verify() {
                if (vaild.validForm(this.userInfo, this)) {
                    this.$toast.loading({
                        message: "注册中...",
                        forbidClick: false
                    });
                    this.axios({
                        method: "POST",
                        url: "/register",
                        data: {
                            appkey: this.appkey,
                            nickName: this.userInfo.userName,
                            password: this.userInfo.password,
                            phone: this.userInfo.phone
                        },
                        transformRequest: Utile.transformRequest
                    })
                        .then(regest => {
                            if (regest.data.code == 100) {
                                this.$toast.clear();
                                this.testShow = true;
                                this.testTitle = "注册成功即将跳转登录页面！！！";
                            } else {
                                this.$toast(regest.data.msg);
                            }
                        })
                        .catch(error => {
                            this.$toast.loading("出错了");
                        });
                }
            },
            // 跳转登录页面
            goLogin() {
                this.$router.push({ name: "Login",query:{name:1}});
            }
        }
    };
</script>
<style lang="less" scoped>
    .sign {
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
            margin: 5px 0;
            text-align: right;
            color: #f7a2ad;
        }
    }
</style>
