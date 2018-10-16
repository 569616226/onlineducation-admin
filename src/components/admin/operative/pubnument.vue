<template>
	<div>
		<div class="admin_title">
			{{$route.meta.title}}
		</div>
		<el-tabs v-model="activeName2" type="card" class="padding-top">
			<el-tab-pane label="被关注回复" name="first">
				<reply></reply>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import reply from './../operative/pubnument/reply.vue'
	export default {
		components: {
			reply
		},
		data() {
			return {
				activeName2: 'first'
			};
		},
		methods: {
			handleClick(tab, event) {
				// console.log(tab, event);
			}
		}
	}
</script>