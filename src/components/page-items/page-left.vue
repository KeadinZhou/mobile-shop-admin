<template>
    <el-menu class="page-left" :default-active="this.$route.path" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <template v-if="this.$store.state.user.id !== -9">
            <el-submenu index="1">
                <span slot="title">首页管理</span>
                <el-menu-item index="/" class="nav-item" route="/">轮播图设置</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <span slot="title">分类管理</span>
                <el-menu-item index="/" class="nav-item" route="/">分类管理</el-menu-item>
            </el-submenu>
        </template>
    </el-menu>
</template>

<script>
    export default {
        name: "page-left"
    }
</script>

<style scoped>
    .page-left{
        height: 100%;
    }
</style>