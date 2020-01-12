<template>
    <div class="img-list">
        <div class="img-box" v-for="(item, index) in imgList" :key="index">
            <el-image
                    fit="contain"
                    style="width: 400px; height: 250px"
                    :src="item">
            </el-image>
            <el-button type="danger" style="position: relative;left: 50%;transform: translate(-50%,0);" @click="delImg(index)">删除</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "img-list-frame",
        props: {
            imgList: Array
        },
        methods:{
            delImg(index) {
                const that = this
                this.$confirm('确认删除该图片吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$emit('delImg', index)
                }).catch(() => {});
            }
        },
        data() {
            return{

            }
        },
    }
</script>

<style scoped>
    .img-box{
        width: 400px;
        height: 300px;
        margin-bottom: 10px;
    }
    .img-list{
        display: flex;
        justify-content: space-around;
        justify-items: center;
        flex-wrap: wrap;
    }
</style>