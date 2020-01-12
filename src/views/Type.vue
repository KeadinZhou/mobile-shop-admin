<template>
    <div>
        <el-card class="box-card" shadow="hover">
            <h2 style="margin-top: 20px;text-align: center">分类管理</h2>
            <el-button class="center-button" @click="openAdd(1)">新建一级分类</el-button>
            <el-collapse>
                <template v-for="(item, index) in $store.state.types">
                    <el-collapse-item :key="index" v-if="item.parent_id === 1">
                        <template slot="title">
                            {{item.name}}
                        </template>
                        <el-button-group class="center-button">
                            <el-button type="primary" @click="openEdit(item)">编辑“{{item.name}}”</el-button>
                            <el-button type="danger" @click="delType(item.id,item.name)">删除“{{item.name}}”</el-button>
                            <el-button type="success" @click="openAdd(item.id)">在“{{item.name}}”下添加子分类</el-button>
                        </el-button-group>
                        <el-divider></el-divider>
                        <div class="img-list">
                            <template v-for="(itemm,indexx) in $store.state.types">
                                <div :key="indexx" v-if="itemm.parent_id===item.id" style="width: 250px">
                                    <el-image
                                            fit="cover"
                                            style="width: 250px; height: 250px"
                                            :src="itemm.image_list.length?itemm.image_list[0]:'#'">
                                        <div slot="error" style="color: #909399;text-align: center;font-size: 14px">
                                            暂无图片
                                        </div>
                                    </el-image>
                                    <h3 style="text-align: center">{{itemm.name}}</h3>
                                    <el-button-group class="center-button">
                                        <el-button type="primary" @click="openEdit(itemm)">编辑</el-button>
                                        <el-button type="danger" @click="delType(itemm.id,itemm.name)">删除</el-button>
                                    </el-button-group>
                                </div>
                            </template>
                        </div>
                    </el-collapse-item>
                </template>
            </el-collapse>
        </el-card>

        <el-dialog title="新建分类" :visible.sync="typeAddShow" append-to-body width="500px" :before-close="handleClose">
            <el-input v-model="itemData.name" placeholder="分类名称"></el-input>
            <upload-button :text="itemData.image_list.length?'更换图片':'添加新图片'" @uploadOK="itemData.image_list=[$event]"></upload-button>
            <el-image fit="contain" style="width: 100%" :src="itemData.image_list.length?itemData.image_list[0]:''">
                <div slot="error" style="color: #909399;text-align: center;font-size: 14px">
                    暂无图片
                </div>
            </el-image>
            <el-button class="center-button" type="success" :disabled="itemData.name===''" :loading="adding" @click="addType">新建</el-button>
        </el-dialog>

        <el-dialog title="编辑分类" :visible.sync="typeEditShow" append-to-body width="500px" :before-close="handleClose">
            <el-input v-model="itemData.name" placeholder="分类名称"></el-input>
            <upload-button :text="itemData.image_list.length?'更换图片':'添加新图片'" @uploadOK="itemData.image_list=[$event]"></upload-button>
            <el-image fit="contain" style="width: 100%" :src="itemData.image_list.length?itemData.image_list[0]:''">
                <div slot="error" style="color: #909399;text-align: center;font-size: 14px">
                    暂无图片
                </div>
            </el-image>
            <el-button class="center-button" type="success" :disabled="itemData.name===''" :loading="saving" @click="saveType">保存</el-button>
        </el-dialog>

    </div>
</template>

<script>
    import UploadButton from '@/components/page-items/upload-button'
    export default {
        name: "Type",
        components: {
            'upload-button': UploadButton
        },
        data () {
            return {
                typeAddShow: false,
                typeEditShow: false,
                adding: false,
                saving: false,
                itemData: {
                    id: 0,
                    image_list: [],
                    name: '',
                    parent_id: 0
                }
            }
        },
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(() => {
                        done();
                    })
                    .catch(() => {});
            },
            openAdd(id){
                this.itemData= {
                    image_list: [],
                    name: '',
                    parent_id: id
                }
                this.typeAddShow = true
            },
            openEdit(data){
                this.itemData=data
                this.typeEditShow = true
            },
            addType () {
                const that = this
                that.adding = true
                that.$http.post(that.$store.state.api + '/category', {
                    image_list: JSON.stringify(that.itemData.image_list),
                    name: that.itemData.name,
                    parent_id: that.itemData.parent_id
                })
                    .then(data => {
                        const Data = data.data.data
                        console.log(Data)
                        this.$store.commit('updateTypes')
                        that.$message.success('新增成功')
                        that.adding = false
                        that.typeAddShow = false
                    })
                    .catch(function (error) {
                        that.adding = false
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
            },
            saveType () {
                const that = this
                that.saving = true
                that.$http.post(that.$store.state.api + '/category/'+that.itemData.id, {
                    image_list: JSON.stringify(that.itemData.image_list),
                    name: that.itemData.name,
                    parent_id: that.itemData.parent_id
                })
                    .then(data => {
                        const Data = data.data.data
                        console.log(Data)
                        this.$store.commit('updateTypes')
                        that.$message.success('修改成功')
                        that.saving = false
                        that.typeEditShow = false
                    })
                    .catch(function (error) {
                        that.saving = false
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
            },
            delType(id,name){
                const that = this
                that.$confirm('确认删除"'+name+'"吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$http.delete(that.$store.state.api + '/category/'+id)
                        .then(data => {
                            const Data = data.data.data
                            console.log(Data)
                            this.$store.commit('updateTypes')
                            that.$message.success('删除成功')
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
                }).catch(() => {});
            },
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
    .center-button{
        position: relative;
        left: 50%;
        transform: translate(-50%,0);
        margin-top: 10px;
        margin-bottom: 20px;
    }
    .img-list{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
</style>