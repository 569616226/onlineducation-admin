<template>
     <div>
        <div class="admin_title">
            {{$route.meta.title}}
        </div>
            <videostable></videostable>
     </div>
</template>

<script>
   import videostable from './../teachtask/videos/videostable.vue'
    export default {
        components: {
            videostable
        },
        data() {
            return {
                
            }
        },
        mounted: function() {
            //          console.log(this.$route)
        }
    }
</script>