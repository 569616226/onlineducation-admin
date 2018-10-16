<template>
    <div>
    <div class="admin_title margin-bottom">
        {{$route.meta.title}}
    </div>
    <data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">

        <el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
            <el-col :span="2"  class="delete_comment">
                <el-button type="primary" @click="$router.push({name: 'add_account'})">新建账号</el-button>
            </el-col>
            <el-col :span="16" :offset="6" class="text-align-right">
                <el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索账号/姓名" class="class_input_width">
                </el-input>
            </el-col>
        </el-row>
        <el-table-column width="85" prop="index" label="编号" key="index" sortable="custom">
                <template slot-scope="scope">
                    <div>{{scope.$index  + 1}}</div>
                </template>
        </el-table-column>
        <el-table-column width="255" prop="nickname" label="姓名" key="nickname" sortable="custom">
            <template slot-scope="scope">
                <h1 @click="colmentshow(scope)" class="blue cursor">{{scope.row.nickname}}</h1>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="账号" key="name" sortable="custom">
        </el-table-column>
        <el-table-column prop="role[0].display_name" label="角色" key="role" sortable="custom">
        </el-table-column>
<!--         <el-table-column prop="creater" label="创建人" key="creater" sortable="custom">
        </el-table-column> -->
        <el-table-column prop="created_at" label="创建时间" key="created_at" sortable="custom">
        </el-table-column>
        <el-table-column label="操作" width="135">
            <template slot-scope="scope">
                <el-dropdown split-button @click="editaccount(scope.row)" @command="customButtonsForRowtwo">
                    编辑
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command='{command: "c",scope:scope}' v-if="scope.row.frozen == 1">解冻</el-dropdown-item>
                        <el-dropdown-item :command='{command: "b",scope:scope}' v-if="scope.row.frozen == 0">冻结</el-dropdown-item>
                        <el-dropdown-item :command='{command: "a",scope:scope}'>删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
        </el-table-column>
    </data-tables>
     <el-dialog title="账号详情" :visible.sync="previewcol" class="previewcol">
            <div class="cl-box" style="width:100%;">
                <div class="cl-row">
                    <div class="cl-td">
                          <p>编号</p>
                    </div>
                    <div class="cl-td">
                         <p>{{colshowlog.index + 1}}</p>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                         <p>姓名</p>
                    </div>
                    <div class="cl-td">
                          <p>{{colshowlog.nickname}}</p>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                        <p>账号</p>
                    </div>
                    <div class="cl-td">
                        <p>{{colshowlog.name}}</p>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                         <p>角色</p>
                    </div>
                    <div class="cl-td">
                        <p>{{colshowlog.roler}}</p>
                    </div>
                </div> 
                <div class="cl-row">
                    <div class="cl-td">
                         <p>创建时间</p>
                    </div>
                    <div class="cl-td">
                        <p>{{colshowlog.created_at}}</p>
                    </div>
                </div>                 
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="previewcol = false">取 消</el-button>
                <el-button type="primary" @click="editaccount(colshowlog)">编 辑</el-button>
            </div>
        </el-dialog>
        </div>
</template>

<script>
    export default {
        data() {
            return {
                data: [],
                customFilters: [{
                    vals: '',
                    props: ['name', 'nickname', 'created_at'],
                }],
                loading: false,
                multipleSelection: [],
                // 表格属性设置
                tableProps : {
                     border: false,    //去掉边框
                     // stripe: false  //去掉斑马纹
                },
                //分页设置
                paginationDef : {
                     pageSize: 10,
                     pageSizes: [10, 20, 50]
                },
                previewcol: false,
                loading : false,
                //存放弹出框的数据
                colshowlog:{},
            }
        },
        methods: {
            getuser(){
                this.loading = true;
                axios.get('/admin/user/lists')
                .then((res) => {
                    this.data = res.data;
                    this.loading = false;
                })
                .catch((error) => {
                    this.loading = false;
                    console.log(error);
                })
            },
            editaccount(row) {
                let id = row.id;
                 this.$router.push({name: 'edit_account',
                    params: {
                        id
                    }
                })
            },
            colmentshow(scope) {
                this.colshowlog = scope.row;
                this.colshowlog.index = scope.$index;
                // 角色由数组改成了单个（后台返回的还是数组，没有改成键值对，所以要取数组的第一个）
                this.colshowlog.roler = scope.row.role[0].display_name;
                this.previewcol = true;
            },
            customButtonsForRowtwo(row) {
                // 删除
                if(row.command == "a") {
                    this.$confirm('确定删除该账号吗？','提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() =>{
                        axios.get('/admin/user/'+ row.scope.row.id +'/delete')
                        .then((res) => {
                            this.data.splice(row.scope.$index, 1);
                            this.$message.success(res.data.message);
                        }).catch((error) => {
                            console.log(error);
                            this.loading = false;
                        });
                    }).catch((res) => {
                        this.$message.info('已取消删除');
                    })
                } else if(row.command == "b") {
                   this.$confirm('确定冻结该账号吗？','提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() =>{
                        axios.get('/admin/user/'+ row.scope.row.id +'/frozen')
                        .then((res) =>{
                            this.data[row.scope.$index].frozen = 1;
                            this.$message.success(res.data.message);
                        })
                        .catch((error) => {
                            console.log(error);
                            this.loading = false; 
                        });
                    }).catch(() => {
                        this.$message.info('已取消冻结');  
                    })
                } else if(row.command == "c") {
                    this.$confirm('确定解冻该账号吗？','提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() =>{
                        axios.get('/admin/user/'+ row.scope.row.id +'/refrozen')
                        .then((res) =>{
                            this.data[row.scope.$index].frozen = 0;
                            this.$message.success(res.data.message);
                        })
                        .catch((error) => {
                            console.log(error);
                            this.loading = false;
                        });
                    }).catch(() => {
                        this.$message.info('已取消解冻');  
                    })
                }
            }
        },
        mounted: function() {
            this.getuser()
        }
    }
</script>
<style scoped>
.delete_comment{text-align:left}
.xuan{line-height:1;padding:10px 15px;display:inline-block}
.demo-table-expand{font-size:0}
.demo-table-expand label{width:90px;color:#99a9bf}
.demo-table-expand .el-form-item{margin-right:0;margin-bottom:0;width:50%}
.class_el_row{margin-bottom:10px;padding:10px;background:#F5F5F5;border-radius:4px}
.el-table td,.el-table th{padding:12px 0 12px 10px}
.student_show_dialog{border-top:1px solid #e3e3e3;border-left:1px solid #e3e3e3}
.student_show_dialog_two{padding:10px 0 10px 30px;border-right:1px solid #e3e3e3;border-bottom:1px solid #e3e3e3}
.line_height_160{line-height:140px}
.height_160{height:160px}
.class_input_width{width:14rem}
</style>