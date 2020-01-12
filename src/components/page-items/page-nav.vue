<template>
    <div id="page-top">
        <el-menu :default-active="this.$route.path" class="page-nav" style="height:60px;width:100%;z-index:1000" mode="horizontal" router>
            <template v-if="this.$store.state.user.id !== -9">
                <el-menu-item index="/index" class="nav-item" route="/index">首页管理</el-menu-item>
                <el-menu-item index="/type" class="nav-item" route="/type">分类管理</el-menu-item>
                <el-menu-item index="/item" class="nav-item" route="/item">产品管理</el-menu-item>
            </template>
            <div class="userBox">
                <template v-if="this.$store.state.user.id !== -9">
                    <span style="margin-right: 20px">Welcome,Admin</span>
                    <el-button icon="el-icon-user" @click="logout">Logout</el-button>
                </template>
                <template v-else>
                    <el-button type="primary" icon="el-icon-user" @click="$router.push('/')">Login</el-button>
                </template>
            </div>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: 'page-nav',
        data () {
            return {
            }
        },
        methods: {
            logout(){
                this.$store.commit('logoutUser')
            }
        }
    }
</script>

<style scoped>
    .nav-item{
        font-size: 16px;
    }
    .userBox{
        position: relative;
        float: right;
        right: 20px;
        top: 50%;
        transform: translate(0,-50%);
        outline:none;
        font-size: 15px;
    }
</style>
