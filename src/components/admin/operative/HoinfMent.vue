<template>
	<div>
		<div class="admin_title">
			{{$route.meta.title}}
		</div>
		<el-tabs v-model="activeName2" type="card" class="padding-top">
			<el-tab-pane label="最近更新设置" name="first">
				<hoinfsettings></hoinfsettings>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import hoinfsettings from './../operative/HoinfMent/hoinfsettings.vue'
	export default {
		components: {
			hoinfsettings
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