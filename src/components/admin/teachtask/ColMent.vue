<template>
	<div>
		<div class="admin_title">
			{{$route.meta.title}}
		</div>
		<colmenttable></colmenttable>
	</div>
</template>

<script>
	import colmenttable from './../teachtask/colment/colmenttable.vue'
	export default {
		components: {
			colmenttable
		}
	}
</script>