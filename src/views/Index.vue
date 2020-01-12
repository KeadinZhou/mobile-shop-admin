<template>
    <div>
        <el-card class="box-card" shadow="hover">
<!--            <h2 style="text-align: center">首页轮播图设置</h2>-->
            <upload-button text="添加新图片" @uploadOK="newImg"></upload-button>
            <img-list-frame :img-list="imgList" @delImg="delImgs"></img-list-frame>
        </el-card>
    </div>
</template>

<script>
    import ImgListFrame from '@/components/page-items/img-list-frame'
    import UploadButton from '@/components/page-items/upload-button'
    export default {
        name: "Index",
        components: {
            'img-list-frame': ImgListFrame,
            'upload-button': UploadButton
        },
        data () {
            return {
                imgList: []
            }
        },
        methods: {
            getData () {
                const that = this
                if(that.$store.state.types.length === 0) {
                    setTimeout( () => {
                        that.getData()
                    }, 200)
                    return
                }
                that.imgList = that.$store.state.types[0].image_list
            },
            delImgs (index) {
                this.imgList.splice(index,1)
                this.saveChange()
            },
            newImg (url) {
                this.imgList.push(url)
                this.saveChange()
            },
            saveChange () {
                const that = this
                that.$http.post(that.$store.state.api + '/category/1', {
                    image_list: JSON.stringify(that.imgList),
                    name: '首页',
                    id: 1,
                    parent_id: null
                })
                    .then(data => {
                        const Data = data.data.data
                        console.log(Data)
                        that.$message.success('保存成功')
                    })
                    .catch(function (error) {
                        if (error.response) {
                            const tmp = error.response.data.msg
                            if ((typeof tmp) === 'string') {
                                that.$message.error(tmp)
                            } else {
                                for (const index in tmp) {
                                    that.$message.error(tmp[index][0])
                                    break
                                }
                            }
                        }
                    })
            }
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped>
    .box-card{
        position: relative;
        left: 50%;
        transform: translate(-50%,0);
        width: 900px;
    }
</style>