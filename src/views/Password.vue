<template>
    <div class="password">
        <van-nav-bar
            title="修改密码"
            left-text="返回"
            left-arrow
            :border="false"
            @click-left="onClickLeft"
            class="nav"
        />
        <div class="change-pass">
            <van-form validate-first @failed="onFailed" @submit="onSubmit">
                <!-- 通过 pattern 进行正则校验 -->
                <van-field
                    v-model="password.oldWords"
                    name="password"
                    placeholder="旧密码"
                    autocomplete="off"
                />
                <van-field
                    v-model="password.password"
                    name="password"
                    placeholder="新密码"
                    :rules="[{ pattern }]"
                    autocomplete="off"
                />
                <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit">提&nbsp;交</van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script>
    import vaild from "../Utils/valids";
    import { Utile } from "../Utils/Utilse";

    export default {
        name: "Password",
        data() {
            return {
                pattern: /^(?=.*[A-Z]+).{6,16}$/,
                password: {
                    oldWords: "",
                    password: ""
                }
            };
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1);
            },
            // 提交表单验证不通过时触发
            onFailed(errorInfo) {
                
                for (let key in this.password) {
                    if (this.password[key] == "") {
                        this.$toast(key + "没有填写");
                        return;
                    }
                }
            },
            onSubmit() {
                let tokenString = localStorage.getItem("_t");
                if (vaild.validForm({ password: this.password.password }, this)) {
                    if (this.password.password == this.password.oldWords) {
                        this.$toast("两次密码不能一致");
                        return;
                    }
                    this.axios({
                        url: "/updatePassword",
                        method: "POST",
                        data: {
                            appkey: this.appkey,
                            tokenString,
                            password: this.password.password,
                            oldPassword: this.password.oldWords
                        },
                        transformRequest: Utile.transformRequest
                    })
                        .then(result => {
                            
                            if (result.data.code == "E001") {
                                this.$router.push({ name: "My" });
                            }
                            this.$toast(result.data.msg);
                        })
                        .catch(() => {
                            
                        });
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    /deep/ .van-nav-bar .van-icon,
    /deep/.van-nav-bar__text {
        color: #ff7f8c;
    }
    .van-button--info {
        background: #f7a2ad;
        border-color: #f7a2ad;
        font-size: 16px;
    }
    .password {
        width: calc(100% - 20px);
        height: calc(100% - 30px);
        padding:20px 10px 10px;
        .change-pass {
            width: calc(100% - 20px);
            background: #fff;
            margin: 15px 10px 10px;
            border-radius: 10px;
            overflow: hidden;
        }
    }
</style>