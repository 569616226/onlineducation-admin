<template>
    <div>
         <div class="admin_title margin-bottom">
            {{$route.meta.title}}
        </div>
    <data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">

        <el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
            <el-col :span="2"  class="delete_comment">
                <el-button type="primary" @click="$router.push({name: 'add_role'})">新建角色</el-button>
            </el-col>
            <el-col :span="16" :offset="6" class="text-align-right">
                <el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索角色名/标识" class="class_input_width">
                </el-input>
            </el-col>
        </el-row>
        <el-table-column width="85" prop="index" label="编号" key="index" sortable="custom">
             <template slot-scope="scope">
                    <div>{{scope.$index  + 1}}</div>
             </template>
        </el-table-column>
        <el-table-column width="255" prop="display_name" label="角色名称" key="display_name" sortable="custom">
            <template slot-scope="scope">
                <h1  @click="colmentshow(scope)" class="blue cursor">{{scope.row.display_name}}</h1>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="标识" key="name" sortable="custom">
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" key="created_at" sortable="custom">
        </el-table-column>
        <el-table-column label="操作" width="135">
            <template slot-scope="scope">
                <el-dropdown split-button @click="editrole(scope.row)" @command="customButtonsForRowtwo">
                    编辑
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command='{command: "a",scope:scope}'>删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
        </el-table-column>
    </data-tables>
    <el-dialog title="角色详情" :visible.sync="previewcol" class="previewcol">
            <el-row class="student_show_dialog">
                 <el-col :span="8" class="student_show_dialog_two light_gray_bg">
                    <p>编号</p>
                </el-col>
                <el-col :span="16" class="student_show_dialog_two light_gray_bg">
                    <p>{{colshowlog.index + 1}}</p>
                </el-col>
                <el-col :span="8" class="student_show_dialog_two">
                    <p>角色名称</p>
                </el-col>
                <el-col :span="16" class="student_show_dialog_two">
                    <p>{{colshowlog.display_name}}</p>
                </el-col>
                <el-col :span="8" class="student_show_dialog_two light_gray_bg">
                    <p>标识</p>
                </el-col>
                <el-col :span="16" class="student_show_dialog_two light_gray_bg">
                    <p>{{colshowlog.name}}</p>
                </el-col>
                 <el-col :span="8" class="student_show_dialog_two">
                    <p>创建时间</p>
                </el-col>
                <el-col :span="16" class="student_show_dialog_two">
                    <p>{{colshowlog.created_at}}</p>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="previewcol = false">取 消</el-button>
                <el-button type="primary" @click="editrole(colshowlog)">编 辑</el-button>
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
                    props: ['display_name', 'name'],
                }],
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
            //获取角色列表
            getrole() {
                let that = this;
                this.loading = true;
                axios.get('/admin/role/lists')
                  .then(function (res) {
                    that.data = res.data;
                    that.loading = false;
                  })
                  .catch(function (error) {
                    console.log(error);
                    this.loading = false;
                  });
            },
            colmentshow(scope) {
                this.colshowlog = scope.row;
                this.colshowlog.index = scope.$index;
                this.previewcol = true
            },
            editrole(row) {
                // this.$message(`repairing ${row.id}`)
                let id = row.id;
                 this.$router.push({name: 'edit_role',
                    params: {
                        id
                    }
                })
            },
            customButtonsForRowtwo(row) {
                if(row.command == "a") {
                    this.$confirm('确定删除该角色吗？', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消'
                    })
                    .then(() =>{
                        this.loading = true;
                         axios.get('/admin/role/' + row.scope.row.id + '/delete')
                        .then((res) => {
                            if(res.data.status){
                             this.data.splice(row.scope.$index, 1);
                             this.$message.success(res.data.message);
                            }else {
                             this.$message.warning(res.data.message);
                            }
                           
                            this.loading = false;
                        })
                        .catch((error) => {
                            console.log(error);
                            this.loading = false;
                        })
                    }).catch(() => {
                      this.$message.info('已取消');
                    })
                } else if(row.command == "b") {
                    //this.$message(`repairing ${row.scope.id}`);
                   
                }
                //this.$message(`repairing ${command.id}`);
            }
        },
        mounted: function() {
            this.getrole()
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