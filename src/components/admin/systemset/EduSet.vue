<template>
    <div>
        <div class="admin_title">
            {{$route.meta.title}}
        </div>
        <el-tabs v-model="activeName2" type="card" class="padding-top">
            <el-tab-pane label="购买须知模板" name="first">
                <buytemplate></buytemplate>
            </el-tab-pane>
        </el-tabs>
    </div>

</template>

<script>
    import buytemplate from './../systemset/EduSet/buyTemplate.vue'
    export default {
        components: {
            buytemplate
        },
        data() {
            return {
                activeName2: 'first'
            }
        },
        mounted: function() {
            //          console.log(this.$route)
        }
    }
</script>