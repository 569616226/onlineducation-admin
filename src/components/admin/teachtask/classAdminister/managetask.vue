<template>
	<div>
		<managetask v-if="man_one" :data="managetaskdata" :loading="loading"></managetask>
		<information v-if="man_two" :sections="informationdata" :loading="loading" :data="managetaskdata"></information>
		<management v-if="man_three" :data="managetaskdata" :loading="loading"></management>
	</div>
</template>

<script>
	import managetask from './coursemanage/managetask.vue'
	import information from './coursemanage/information.vue'
	import management from './coursemanage/management.vue'
	export default {
		components: {
			managetask,
			information,
			management
		},
		data() {
			return {
				man_one: true,
				man_two: false,
				man_three: false,
				managetaskdata: [],
				informationdata: [],
				loading: false
			}
		},
		methods: {
			getdata() {
				this.loading = true
				axios.get('/admin/lesson/' + this.$route.params.id)
					.then((res) => {
						this.managetaskdata = res.data.lesson
						this.managetaskdata.lesson_names = res.data.lesson_names
						this.informationdata = res.data.lesson.sections
						this.loading = false
					})
					.catch((error) => {

					})
			}

		},
		mounted() {
			this.getdata()
		}
	}
</script>