<template>
    <div class="main">
        <!-- 二级路由入口 -->
        <router-view></router-view>

        <!-- 底部导航 -->
        <van-tabbar v-model="active" class="navPage">
            <van-tabbar-item
                v-for="(item,i) in navPageData"
                :key="i"
                @click="cutRoute(item,i)"
                :badge="item.badge"
            >
                <span class="text">{{item.title}}</span>
                <template #icon="props">
                    <img :src="props.active ? item.active : item.inactive" />
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
    import { Utile } from "../Utils/Utilse";
    export default {
        name: "Main",
        data() {
            return {};
        },
        computed: {
            active: {
                get() {
                    return this.$store.state.MainModule.active;
                },
                set(val) {}
            },
            navPageData() {
                return this.$store.state.MainModule.navPageData;
            }
        },
        created() {
            let tokenString = localStorage.getItem("_t");
            if (tokenString != "..") {
            this.$store.commit("MainModule/getShopCount", {self:this,tokenString:tokenString});
            } else {
                this.$store.commit("MainModule/changeShopCount", 0);
            }
        },
        methods: {
            cutRoute(item, index) {
                this.$router.push({ name: item.name });
            }
        }
    };
</script>

<style lang="less" scoped>
    .main {
        height: 100%;
        .navPage {
            border-top: 1px solid #ddd;
            .text {
                color: #893e23;
            }
        }
    }
</style>