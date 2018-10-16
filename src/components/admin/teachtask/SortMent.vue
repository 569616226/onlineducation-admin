<template>
	<div v-loading="loading">
		<div class="admin_title">
			{{$route.meta.title}}
		</div>
		<div class="sortMenu">
			<p class="sortMenu-h1">标签说明</p>
			<p class="sortMenu-p">
				（1）给课程添加了标签，可以通过搜索分类找到网站与这个标签相关的内容，如搜索了“报关”这词，会显示设置标签为“报关”的课程；分类后续版本作为课程推荐的依据；
			</p>
			<p class="sortMenu-p">
				（2）标签和分类的区别：标签可以把不同栏目的相关课程联系起来。比如：国贸、外贸，有可能会有人将分类设置为：国内贸易、国际贸易，那么，就可以通过“贸易”这个标签，将国内贸易和国际贸易联系起来；
			</p>
			<p class="sortMenu-p">
				（3）标签在后续版本，可以做热门搜索关键词管理；
			</p>
		</div>
		<div class="sortMenu-tag">
			<el-tag class="sortMenu-tag-name" :key="index" v-for="tag,index in GenreListsData" :closable="closable" :disable-transitions="false" @close="handleClose(tag)">
				<span class="sortMenu-tag-name-span" @click="openEdit(tag)">{{tag.name}}</span>
			</el-tag>
			<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
			</el-input>
			<el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
		</div>
		<el-dialog title="编辑标签" :visible.sync="dialogFormVisible" width="500px" v-loading="edtiLoading">
			<el-form>
				<el-form-item label="标签名称" :label-width="formLabelWidth">
					<el-input v-model="editValue" auto-complete="off" class="sortMenu-edit"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="editGenre">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import api from '@/utils/api'
	export default {
		data() {
			return {
				data: [],
				customFilters: [{
					vals: '',
					props: ['name'],
				}],
				loading: false,
				tableProps: {
					border: false, //去掉边框
					// stripe: false  //去掉斑马纹
				},
				//分页设置
				paginationDef: {
					pageSize: 10,
					pageSizes: [10, 20, 50]
				},
				inputVisible: false,
				inputValue: '',
				closable: true,
				dialogFormVisible: false,
				formLabelWidth: '120px',
				editValue: '',
				editId: '',
				edtiLoading: false
			}
		},
		computed: {
			...mapState({
				GenreListsData: state => state.Admin.GenreListsData
			})
		},
		methods: {
			...mapActions([
				'getGenreLists'
			]),
			async editGenre() {
				if(this.editValue == '') {
					this.$message.error('请填写内容')
					return false
				}
				this.edtiLoading = true
				this.dialogFormVisible = false
				const data = await api.editGenre(this.editId, this.editValue)
				await this.getGenreLists()
				this.edtiLoading = false
				if(data.status) {
					this.$message.success(data.message)
				} else {
					this.$message.error(data.message)
				}
			},
			async openEdit(tag) {
				this.editValue = tag.name
				this.editId = tag.id
				this.dialogFormVisible = true
			},
			async gettabledata() { //分类管理表格数据
				if(this.GenreListsData.length == 0) {
					this.loading = true
				}
				await this.getGenreLists()
				this.loading = false
			},
			handleClose(tag) {
				this.$confirm('真的要删除此标签吗？', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async() => {
					this.loading = true
					const data = await api.deleteGenre(tag.id)
					await this.getGenreLists()
					this.loading = false
					if(data.status) {
						this.$message.success(data.message)
					} else {
						this.$message.error(data.message)
					}
				}).catch(() => {

				})
			},
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			async handleInputConfirm() {
				let inputValue = this.inputValue;
				if(inputValue) {
					this.loading = true
					const data = await api.postGenre(inputValue)
					await this.getGenreLists()
					this.loading = false
					if(data.status) {
						this.$message.success(data.message)
					} else {
						this.$message.error(data.message)
					}
				}
				this.inputVisible = false;
				this.inputValue = '';
			}
		},
		mounted() {
			this.gettabledata()
		}
	}
</script>
<style lang="less" scoped>
	.sortMenu {
		background-color: rgb(245, 245, 245);
		border: 1px solid rgb(227, 227, 227);
		border-radius: 4px;
		font-size: 14px;
		margin-top: 1rem;
		padding: 2rem;
		line-height: 25px;
		&-h1 {
			font-weight: 700;
			font-size: 16px;
			color: rgb(16, 16, 16);
		}
		&-p {
			color: rgb(85, 85, 85);
			margin-top: .7rem;
		}
		&-tag {
			margin-top: 2rem;
			&-name {
				font-size: 14px;
				margin-top: 1rem;
				margin-right: 10px;
				&-span {
					cursor: pointer;
				}
			}
		}
		&-edit {
			width: 80%;
		}
	}
	
	.delete_comment {
		text-align: left
	}
	
	.demo-table-expand {
		font-size: 0
	}
	
	.demo-table-expand label {
		width: 90px;
		color: #99a9bf
	}
	
	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%
	}
	
	.class_el_row {
		margin-bottom: 10px;
		padding: 10px;
		background: #F5F5F5;
		border-radius: 4px
	}
	
	.el-table td,
	.el-table th {
		padding: 12px 0 12px 10px
	}
	
	.class_input_width {
		width: 14rem
	}
</style>
<style>
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
		margin-top: 1rem;
	}
	
	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
</style>