<template>
    <div class="account">
        <van-nav-bar
            title="账户管理"
            left-text="返回"
            left-arrow
            :border="false"
            @click-left="onClickLeft"
            class="nav"
        />
        <van-dialog
            v-model="testShow"
            :title="testTitle"
            @cancel="closeAlert"
            @confirm="goLogin"
            show-cancel-button
        ></van-dialog>
        <div class="account-list">
            <div class="list clear" @click="changePassword"> 
                <div class="list_text fl">修改密码</div>
                <div class="list_data fr">
                    <span class="text fl">修改密码</span>
                    <van-icon class="arrow fl" name="arrow" />
                </div>
            </div>
            <div class="list clear" @click="logout">
                <div class="list_text fl">注销账户</div>
                <div class="list_data fr">
                    <span class="text fl">注销后无法恢复，请谨慎操作</span>
                    <van-icon class="arrow fl" name="arrow" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Utile } from '../Utils/Utilse';

    export default {
        name: "Account",
        data() {
            return {
                testShow: false,
                testTitle: "",
                phone: ""
            };
        },
        created() {
            this.phone = this.$route.query.phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2");
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1);
            },
            // 取消注销账号
            closeAlert() {
              this.testShow = false;
            },
            // 确定注销账号
            goLogin() {
              let tokenString = localStorage.getItem("_t");
              this.axios({
                url:'/destroyAccount',
                method:"POST",
                data:{
                  tokenString,
                  appkey:this.appkey
                },
                transformRequest:Utile.transformRequest
              }).then(result=>{
                
                if(result.data.code == "G001"){
                this.$toast("注销成功");
                this.$router.push({name:"My"})
                }
              }).catch(()=>{
                
              })
            },
            // 注销账户
            logout() {
                this.testShow = true;
                this.testTitle = `确定注销${this.phone}所绑定的账号???`;
            },
            changePassword(){
                this.$router.push({name:"Password"})
            }
        }
    };
</script>

<style lang="less" scoped>
    /deep/ .van-nav-bar .van-icon,
    /deep/.van-nav-bar__text {
        color: #ff7f8c;
    }
    /deep/.van-dialog__header--isolated{
      padding:25px 10px;
    }
    .account{
        width:calc(100% - 20px);
        height: calc(100% - 30px);
        padding:20px 10px;
    }
    .account-list {
        width: calc(100% - 20px);
        margin: 10px;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
        .list {
            width: calc(100% - 20px);
            height: 40px;
            padding: 10px;
        }
        .list_text {
            width: 90px;
            height: 100%;
            font-size: 100%;
            line-height: 40px;
            font-size: 15px;
            color: #5c5c55;
        }
        .list_data {
            span,
            div {
                margin-right: 10px;
            }
            .arrow {
                line-height: 40px;
                font-size: 16px;
                color: #b2b2b2;
            }
            .text {
                line-height: 40px;
                font-size: 13px;
                color: #d1d1d1;
            }
        }
    }
</style>