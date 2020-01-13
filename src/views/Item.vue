<template>
    <div>
        <el-card class="box-card" shadow="hover">
            <h2 style="margin-top: 20px;text-align: center">产品管理</h2>
            <el-divider></el-divider>
            <div class="center-button search-box">
                <div>
                    <span style="font-size: 14px">产品名称： </span>
                    <el-input style="width: 200px;" placeholder="产品名称" v-model="keyword"></el-input>
                </div>
                <div>
                    <span style="font-size: 14px">产品分类： </span>
                    <el-cascader style="width: 200px;" v-model="typeChose1" :options="typeList" :props="{ expandTrigger: 'hover' }"></el-cascader>
                </div>
                <el-button type="primary" @click="searchData(1)">查询</el-button>
                <el-button type="success" @click="addShow">新增产品</el-button>
            </div>

            <el-table :data="pageItemList" style="width: 100%">
                <el-table-column label="#" align="center" width="80px">
                    <template slot-scope="scope">
                        {{ scope.row.id }}
                    </template>
                </el-table-column>
                <el-table-column label="产品名称" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column label="产品分类" align="center" width="200px">
                    <template slot-scope="scope">
                        {{ listIdNameMap.get(scope.row.category_id) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="150px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="editShow(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="delItem(scope.row.id,scope.row.name)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    :page-size="pageSize"
                    layout="prev,pager,next"
                    :total="allItemList.length"
                    :current-page="currentPage"
                    align="center"
                    style="margin-top: 20px"
                    @current-change="pageChange">
            </el-pagination>
        </el-card>

        <el-dialog title="新增产品" :visible.sync="itemAddShow" append-to-body width="900px" :before-close="handleClose">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="input-title">产品名称</div>
                    <el-input v-model="itemData.name" placeholder="产品名称"></el-input>
                    <div class="input-title">产品分类</div>
                    <el-cascader style="width: 100%;" v-model="typeChose2" :options="itemTypeList" :props="{ expandTrigger: 'hover' }"></el-cascader>
                </el-col>
                <el-col :span="12">
                    <div class="input-title">产品描述</div>
                    <el-input v-model="itemData.description" placeholder="产品描述" type="textarea" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-col>
            </el-row>
            <upload-button :text="itemData.image_list.length?'更换图片':'添加新图片'" @uploadOK="newImgs"></upload-button>
            <img-list-frame :img-list="itemData.image_list" @delImg="delImgs"></img-list-frame>
            <el-button class="center-button" type="success" :disabled="itemData.name===''||itemData.description===''||typeChose2.length<2" :loading="adding" @click="itemAdd">新建</el-button>
        </el-dialog>

        <el-dialog title="编辑产品" :visible.sync="itemEditShow" append-to-body width="900px" :before-close="handleClose">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="input-title">产品名称</div>
                    <el-input v-model="itemData.name" placeholder="产品名称"></el-input>
                    <div class="input-title">产品分类</div>
                    <el-cascader style="width: 100%;" v-model="typeChose2" :options="itemTypeList" :props="{ expandTrigger: 'hover' }"></el-cascader>
                </el-col>
                <el-col :span="12">
                    <div class="input-title">产品描述</div>
                    <el-input v-model="itemData.description" placeholder="产品描述" type="textarea" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                </el-col>
            </el-row>
            <upload-button :text="itemData.image_list.length?'更换图片':'添加新图片'" @uploadOK="newImgs"></upload-button>
            <img-list-frame :img-list="itemData.image_list" @delImg="delImgs"></img-list-frame>
            <el-button class="center-button" type="success" :disabled="itemData.name===''||itemData.description===''||typeChose2.length<2" :loading="saving" @click="itemSave">保存</el-button>
        </el-dialog>

    </div>
</template>

<script>
    import UploadButton from '@/components/page-items/upload-button'
    import ImgList from '@/components/page-items/img-list-frame'
    export default {
        name: "Item",
        components: {
            'upload-button': UploadButton,
            'img-list-frame': ImgList
        },
        data () {
            return{
                typeList:[],
                typeFatherMap: null,
                itemTypeList: [],
                listIdNameMap: null,
                typeChose1: [0,0],
                typeChose2: [],
                keyword: '',
                allItemList: [],
                pageItemList: [],
                currentPage: 1,
                pageSize: 10,
                itemData: {
                    id: 0,
                    category_id: 0,
                    description: '',
                    image_list: [],
                    name: ''
                },
                itemAddShow: false,
                itemEditShow: false,
                adding: false,
                saving: false
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
            getTypeList () {
                const that = this
                if(!that.$store.state.types.length){
                    setTimeout(()=>{
                        that.getTypeList()
                    },200)
                    return
                }
                that.typeList = [{
                    value: 0,
                    label: '所有分类',
                    children: []
                }]
                that.itemTypeList = []
                that.listIdNameMap = new Map()
                that.typeFatherMap = new Map()
                let item
                for(item of that.$store.state.types){
                    that.listIdNameMap.set(item.id,item.name)
                    that.typeFatherMap.set(item.id,item.parent_id)
                    if(item.parent_id===1){
                        that.typeList.push({
                            value: item.id,
                            label: item.name,
                            children: []
                        })
                        that.itemTypeList.push({
                            value: item.id,
                            label: item.name,
                            children: []
                        })
                    }
                }
                for(let index in that.typeList) {
                    that.typeList[index].children.push({
                        value: 0,
                        label: '全部产品'
                    })
                    for(item of that.$store.state.types){
                        if(item.parent_id===that.typeList[index].value){
                            that.typeList[index].children.push({
                                value: item.id,
                                label: item.name
                            })
                            that.itemTypeList[index-1].children.push({
                                value: item.id,
                                label: item.name
                            })
                        }
                    }
                }
                console.log(that.typeList)
            },
            searchData (page) {
                const that = this
                let sendData = {
                    name: that.keyword,
                    category_id: that.typeChose1[1]!==0?that.typeChose1[1]:(that.typeChose1[0]!==0?that.typeChose1[0]:null)
                }
                that.$http.post(that.$store.state.api + '/item/search', sendData)
                    .then(data => {
                        const Data = data.data.data
                        console.log(Data)
                        that.allItemList = Data
                        that.pageData(that.pageSize, page)
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
            pageData (size, page) {
                const that = this
                that.pageItemList = []
                let len = that.allItemList.length
                let start = size * (page-1)
                let end = start + size
                if (start >= len) return
                if (end >= len) end = len
                that.pageItemList = that.allItemList.slice(start, end)
            },
            pageChange (currentPage) {
                this.pageData(this.pageSize, currentPage)
            },
            delImgs (index) {
                this.itemData.image_list.splice(index,1)
            },
            newImgs (url) {
                this.itemData.image_list.push(url)
            },
            addShow () {
                const that = this
                that.itemData = {
                    category_id: 0,
                    description: '',
                    image_list: [],
                    name: ''
                }
                that.itemAddShow = true
            },
            itemAdd () {
                const that = this
                that.adding = true
                let sendData = JSON.parse(JSON.stringify(that.itemData));
                sendData.image_list = JSON.stringify(sendData.image_list)
                sendData.category_id = that.typeChose2[1]
                console.log(sendData)
                that.$http.post(that.$store.state.api + '/item', sendData)
                    .then(data => {
                        const Data = data.data.data
                        console.log(Data)
                        that.$message.success('新增成功')
                        that.searchData(that.currentPage)
                        that.adding = false
                        that.itemAddShow = false
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
            editShow (item) {
                this.itemData = item
                this.typeChose2 = [this.typeFatherMap.get(item.category_id),item.category_id]
                this.itemEditShow = true
            },
            itemSave () {
                const that = this
                that.saving = true
                let sendData = JSON.parse(JSON.stringify(that.itemData));
                sendData.image_list = JSON.stringify(sendData.image_list)
                sendData.category_id = that.typeChose2[1]
                console.log(sendData)
                that.$http.post(that.$store.state.api + '/item/' + that.itemData.id, sendData)
                    .then(data => {
                        const Data = data.data.data
                        console.log(Data)
                        that.$message.success('保存成功')
                        that.searchData(that.currentPage)
                        that.saving = false
                        that.itemEditShow = false
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
            delItem (id,name){
                const that = this
                that.$confirm('确认删除"'+name+'"吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$http.delete(that.$store.state.api + '/item/'+id)
                        .then(data => {
                            const Data = data.data.data
                            console.log(Data)
                            that.searchData(that.currentPage)
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
        },
        created() {
            this.getTypeList()
            this.searchData(1)
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
    .search-box{
        display: flex;
        justify-content: space-around;
    }
    .input-title {
        text-align: center;
        font-size: 12px;
        color: gray;
        margin: 10px 0;
    }
</style>