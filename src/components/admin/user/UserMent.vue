<template>
    <div>
        <div class="admin_title">
            {{$route.meta.title}}
        </div>
        <el-tabs v-model="activeName" type="card" class="padding-top">
            <el-tab-pane label="用户管理" name="tab1">
                 <userAdmin></userAdmin>
            </el-tab-pane>
            <el-tab-pane label="用户组管理" name="tab2">
               <labelAdmin></labelAdmin>
            </el-tab-pane>
        </el-tabs>
    </div>

</template>

<script>
    import userAdmin from './../user/UserMent/userAdmin.vue'
    import labelAdmin from './../user/UserMent/labelAdmin.vue'
    export default {
        components: {
            userAdmin,
            labelAdmin
        },
        data() {
            return {
                activeName: ''
            }
        },
        mounted: function() {
             if(this.$route.params.tabActive == 2){
                this.activeName = 'tab2';
             }else {
                this.activeName = 'tab1';
             }
        }
    }
</script>