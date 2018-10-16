<template>
     <div>
        <div class="admin_title">
            {{$route.meta.title}}
        </div>
        <el-tabs v-model="activeName2" type="card" class="padding-top">
            <el-tab-pane label="系统日志" name="first">
                <data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">

        <el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
            <el-col :span="6">
                <p class="student_custom_p"><el-button type="primary" class="margin-right" @click="getMore()">加载更多</el-button><span class="red"></span></p>
                </el-col>
            <el-col :span="18" class="text-align-right">
            <el-date-picker v-model="seDate" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择日期范围" @change="setEndDate"></el-date-picker>
                <el-select v-model="customFilters[1].vals" placeholder="所有模块" class="class_select_width">
                    <el-option label="所有模块" value=""></el-option>
                    <div v-for="module in allmodule">
                         <el-option  :label="module" :value="module"></el-option>
                    </div>
                </el-select>
                <el-select v-model="customFilters[3].vals" placeholder="所有操作" class="class_select_width">
                    <el-option label="所有操作" value=""></el-option>
                    <div v-for="operation in alloperation">
                         <el-option :label="operation" :value="operation"></el-option>
                    </div>
                </el-select>
                <el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索标题/创建者" class="class_input_width">
                </el-input>
            </el-col>
        </el-row>
        <el-table-column  prop="user" width="180px" label="用户" key="user" sortable="custom">
        </el-table-column>
        <el-table-column  prop="key" width="180px" label="操作" key="key" sortable="custom">
        </el-table-column>
        <el-table-column  prop="revisionable_type" width="180px" label="所属模块" key="revisionable_type" sortable="custom">
        </el-table-column>
         <el-table-column prop="content" label="内容" key="content" sortable="custom">
            <template slot-scope="scope">
                <div v-html="scope.row.content"></div>
            </template>
        </el-table-column>
        <el-table-column prop="created_at" width="200px" label="时间" key="created_at" sortable="custom">
        </el-table-column>
    </data-tables>
            </el-tab-pane>
        </el-tabs>
     </div>
</template>

<script>
Date.prototype.format = function() {  
      var s = '';  
      var mouth = (this.getMonth() + 1)>=10?(this.getMonth() + 1):('0'+(this.getMonth() + 1));  
      var day = this.getDate()>=10?this.getDate():('0'+this.getDate());  
      s += this.getFullYear() + '-'; // 获取年份。  
      s += mouth + "-"; // 获取月份。  
      s += day; // 获取日。  
      return (s); // 返回日期。  
}; 
   export default {
        data() {
            return {
                data: [
                // {
                //     'user_id': '钟荣坤',
                //     'key': '登录',
                //     'old_value': '未登录',
                //     'new_value': '已登录',
                //     'updated_at': '2017-11-10 15:56'
                // }
                ],
                next_page_url : '',
                customFilters: [{
                    vals: '',
                    props: ['user', 'key'],
                }, {
                    vals: []
                }, {
                    vals: []
                }, {
                    vals: []
                }, {
                    vals: []
                }],
                seDate: null,
                endDate: null,
                loading: false,
                multipleSelection: [],
                tableProps : {
                     border: false,    //去掉边框
                     // stripe: false  //去掉斑马纹
                },
                //分页设置
                paginationDef : {
                     pageSize: 10,
                     pageSizes: [10, 20, 50]
                },
                activeName2: 'first',
                allmodule:[],
                alloperation:[]
            }
        },
        methods: {
            // 获取默认的前1000条数据
            getlogs() {
                this.loading =true;
                axios.get('/admin/log/lists')
                .then((res) => {
                    this.loading = false;
                    this.data = res.data.data;
                    this.next_page_url = res.data.next_page_url;
                      //去掉重复，并获得数据中的所有模块和所有操作
                    for (var i = 0; i < this.data.length; i++) {
                        if(this.allmodule.indexOf(this.data[i].revisionable_type) === -1){
                            this.allmodule.push(this.data[i].revisionable_type)
                        }
                        if(this.alloperation.indexOf(this.data[i].key) === -1){
                            this.alloperation.push(this.data[i].key)
                        }
                        this.data[i].nickname = this.data[i].user;
                    }
                })
                .catch((error) => {
                     this.loading = false;
                    console.log('获取系统日志报错')
                    console.log(error);
                })
            },
            // 获取更多数据
            getMore(){
                this.loading = true;
                axios.get(this.next_page_url)
                .then((res) => {
                    this.loading = false;
                    // this.data = res.data.data;
                    const _list = res.data.data;
                    this.data = [...this.data, ..._list];
                    this.next_page_url = res.data.next_page_url;
                    for (var i = 0; i < this.data.length; i++) {
                        if(this.allmodule.indexOf(this.data[i].revisionable_type) === -1){
                            this.allmodule.push(this.data[i].revisionable_type)
                        }
                        if(this.alloperation.indexOf(this.data[i].key) === -1){
                            this.alloperation.push(this.data[i].key)
                        }
                        this.data[i].nickname = this.data[i].user;
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
            },
          setEndDate(val){
            if(val == null){
                this.customFilters[4].vals = "";
                console.log(this.customFilters[4].vals);
            }else{
                let begin = this.$options.methods.getDates(this.seDate[0]);
                let end = this.$options.methods.getDates(this.seDate[1]);
                this.customFilters[4].vals = this.$options.methods.getAll(begin, end);
                console.log(this.customFilters[4].vals);
            }
            },
            getDates(date){
                let elDate = new Date(date);
                return elDate.getFullYear() + '-' + (elDate.getMonth() + 1) + '-' + elDate.getDate();
            },
            getAll(begin, end) {
                var ab = begin.split("-");  
                var ae = end.split("-");  
                var db = new Date();  
                db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);  
                var de = new Date();  
                de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);  
                var unixDb = db.getTime();  
                var unixDe = de.getTime();  
                let idsdate=[];
                for (var k = unixDb; k <= unixDe;) {  
                    idsdate.push((new Date(parseInt(k))).format());  
                    k = k + 24 * 60 * 60 * 1000;  
                }  
                return idsdate;
            }  
        },
        mounted: function() {
            this.getlogs()
        }
    }
</script>
<style scoped>
.delete_comment{text-align:left}
.xuan{line-height:1;padding:10px 15px;display:inline-block}
.demo-table-expand{font-size:0}
.student_custom_p{color:#555;line-height:40px;font-size: 14px;}
.demo-table-expand label{width:90px;color:#99a9bf}
.demo-table-expand .el-form-item{margin-right:0;margin-bottom:0;width:50%}
.class_el_row{margin-bottom:10px;padding:10px;background:#F5F5F5;border-radius:4px}
.el-table td,.el-table th{padding:12px 0 12px 10px}
.class_select_width{width:8rem}
.class_input_width{width:14rem}
</style>