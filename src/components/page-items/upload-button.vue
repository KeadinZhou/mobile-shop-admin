<template>
    <div style="width: 100%">
        <input type="file" id="realUpload" @change="uploadFile" name="file" accept="image/*">
        <el-button class="show-button" type="primary" @click.native="uploadUp" :loading="isUpdating">{{isUpdating?'上传中':(text?text:'上传图片')}}</el-button>
    </div>
</template>

<script>
    export default {
        name: "upload-item",
        props: {
            text: String
        },
        data () {
            return {
                isUpdating: false
            }
        },
        methods: {
            uploadUp () {
                document.getElementById("realUpload").click()
            },
            uploadOK (url) {
                this.isUpdating = false
                this.$message.success('上传成功')
                console.log(url)
                this.$emit('uploadOK',url)
            },
            uploadFile (e) {
                const that = this
                console.log(e.target.files[0])
                var sendData = new FormData()
                sendData.append('file',e.target.files[0])
                that.isUpdating = true
                that.$http.post(that.$store.state.api + '/file', sendData)
                    .then(data => {
                        const Data = data.data.data
                        console.log(Data)
                        that.uploadOK(Data)
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
        }
    }
</script>

<style scoped>
    #realUpload{
        display: none;
    }
    .show-button{
        position: relative;
        left: 50%;
        transform: translate(-50%,0);
        margin: 20px 0;
    }
</style>