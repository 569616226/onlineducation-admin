import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
const parentComponent = {
	template: '<router-view></router-view>'
};
export default new Router({
	mode: 'history',
	routes: [
		//pindex用于定位当前页面的父级菜单，index用于定位当前页面的子级菜单（active），结合状态管理器中返回来的菜单数据中的id使用
		//pindex和index对应的就是菜单数据中的parent_id和id
		{
			path: '',
			component: resolve => require(['../components/admin/Admin.vue'], resolve),
			meta: {
				requireAuth: true,
				pindex: '1',
				index: '1'
			},
			children: [
				// 主页
				{
					path: 'home',
					name: 'home',
					title: '主页',
					component: resolve => require(['../components/admin/home/home.vue'], resolve),
					meta: {
						requireAuth: true,
						pindex: '1',
						index: '7'
					}
				},
				//教务
				{
					path: 'teach',
					name: 'teach',
					component: parentComponent,
					meta: {
						requireAuth: true,
					},
					children: [
						//课程管理（默认进入teachtask路径后就跳入课程管理）
						{
							path: 'teachtasks',
							component: parentComponent,
							meta: {
								requireAuth: true,
							},
							children: [{
								path: '',
								name: 'teachtask',
								component: resolve => require(['../components/admin/teachtask/classAdminister.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '课程管理',
									pindex: '2',
									index: '8'
								}
							}, {
								path: 'SelectClass',
								name: 'SelectClass',
								component: resolve => require(['../components/admin/teachtask/classAdminister/SelectClass.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '新建课程',
									pindex: '2',
									index: '8'
								}
							}, {
								path: 'addtask',
								name: 'addtask',
								component: resolve => require(['../components/admin/teachtask/classAdminister/coursemanage/information.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '新建普通课程',
									pindex: '2',
									index: '8'
								}
							}, {
								path: 'AddInterview',
								name: 'AddInterview',
								component: resolve => require(['../components/admin/teachtask/classAdminister/AddInterview.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '新建访谈课程',
									pindex: '2',
									index: '8'
								}
							}, {
								path: 'EditInterview/:id',
								name: 'EditInterview',
								component: resolve => require(['../components/admin/teachtask/classAdminister/AddInterview.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '编辑访谈课程',
									pindex: '2',
									index: '8'
								}
							}, {
								path: 'managetask/:id',
								name: 'managetask',
								component: resolve => require(['../components/admin/teachtask/classAdminister/managetask.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '管理课程',
									pindex: '2',
									index: '8'
								}
							}, {
								path: 'studentment/:id',
								name: 'studentment',
								component: resolve => require(['../components/admin/teachtask/classAdminister/studentment.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '学员管理',
									pindex: '2',
									index: '8'
								}
							}, {
								path: 'courseoffered/:id',
								name: 'courseoffered',
								component: resolve => require(['../components/admin/teachtask/classAdminister/courseoffered.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '课程设置',
									pindex: '2',
									index: '8'
								}
							}, {
								path: 'ClassData/:id',
								name: 'ClassData',
								component: resolve => require(['../components/admin/teachtask/classAdminister/ClassData.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '课程数据',
									pindex: '2',
									index: '8'
								}
							}]
						},
						//视频库
						{
							path: 'videos',
							component: parentComponent,
							meta: {
								requireAuth: true,
							},
							children: [{
									path: '',
									name: 'videos',
									component: resolve => require(['../components/admin/teachtask/videos.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '视频库',
										pindex: '2',
										index: '9'
									},
								},
								{
									path: 'upload_video',
									name: 'upload_video',
									component: resolve => require(['../components/admin/teachtask/videos/uploadvideo.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '上传视频',
										pindex: '2',
										index: '9'
									},
								},
								{
									path: 'edit_video/:id',
									name: 'edit_video',
									component: resolve => require(['../components/admin/teachtask/videos/editvideo.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '编辑视频',
										pindex: '2',
										index: '9'
									},
								}
							]
						},
						//分类管理
						{
							path: 'colment',
							component: parentComponent,
							meta: {
								requireAuth: true,
							},
							children: [{
								path: '',
								name: 'colment',
								component: resolve => require(['../components/admin/teachtask/ColMent.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '分类管理',
									pindex: '2',
									index: '10'
								},
							}, {
								path: 'addcol',
								name: 'addcol',
								component: resolve => require(['../components/admin/teachtask/colment/addcol.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '新建分类',
									pindex: '2',
									index: '10'
								},
							}, {
								path: 'editcol/:id',
								name: 'editcol',
								component: resolve => require(['../components/admin/teachtask/colment/addcol.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '编辑分类',
									pindex: '2',
									index: '10'
								},
							}]
						},
						//标签管理
						{
							path: 'sortment',
							component: parentComponent,
							meta: {
								requireAuth: true,
							},
							children: [{
								path: '',
								name: 'sortment',
								component: resolve => require(['../components/admin/teachtask/SortMent.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '标签管理',
									pindex: '2',
									index: '11'
								},
							}, {
								path: 'addsort',
								name: 'addsort',
								component: resolve => require(['../components/admin/teachtask/sortment/addsort.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '新建分类',
									pindex: '2',
									index: '11'
								},
							}, {
								path: 'editsort/:id',
								name: 'editsort',
								component: resolve => require(['../components/admin/teachtask/sortment/addsort.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '编辑分类',
									pindex: '2',
									index: '11'
								},
							}]
						},
						//评论管理
						{
							path: 'revment',
							component: parentComponent,
							meta: {
								requireAuth: true,
							},
							children: [{
								path: '',
								name: 'revment',
								component: resolve => require(['../components/admin/teachtask/RevMent.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '评论管理',
									pindex: '2',
									index: '12'
								},
							}]
						},
					]
				},
				//运营
				{
					path: 'operative',
					component: parentComponent,
					meta: {
						requireAuth: true,
					},
					children: [
						//消息推送管理
						{
							path: 'operative',
							component: parentComponent,
							meta: {
								requireAuth: true,
							},
							children: [{
									path: '',
									name: 'operative',
									component: resolve => require(['../components/admin/operative/OperativeNotify.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '消息推送管理',
										pindex: '3',
										index: '13'
									}
								}, {
									path: 'chooseoperative',
									name: 'chooseoperative',
									component: resolve => require(['../components/admin/operative/OperativeNotify/chooseoperative.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '新建消息',
										pindex: '3',
										index: '13'
									}
								},
								{
									path: 'addoperative',
									name: 'addoperative',
									component: resolve => require(['../components/admin/operative/OperativeNotify/addoperative.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '新建纯文本消息',
										pindex: '3',
										index: '13'
									}
								},
								{
									path: 'addImgAndText',
									name: 'addImgAndText',
									component: resolve => require(['../components/admin/operative/OperativeNotify/addImgAndText.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '新建图文消息',
										pindex: '3',
										index: '13'
									}
								}
							]
						},
						//广告管理
						{
							path: 'adalert',
							component: parentComponent,
							meta: {
								requireAuth: true,
							},
							children: [{
								path: '',
								name: 'adalert',
								component: resolve => require(['../components/admin/operative/AdAlert.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '广告管理',
									pindex: '3',
									index: '14'
								}
							}, {
								path: 'addadalert',
								name: 'addadalert',
								component: resolve => require(['../components/admin/operative/AdAlert/addadalert.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '新建广告',
									pindex: '3',
									index: '14'
								}
							}, {
								path: 'editadalert/:id',
								name: 'editadalert',
								component: resolve => require(['../components/admin/operative/AdAlert/addadalert.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '编辑广告',
									pindex: '3',
									index: '14'
								}
							}]
						},
						//VIP会员管理
						{
							path: 'vipment',
							component: parentComponent,
							meta: {
								requireAuth: true,
							},
							children: [{
								path: '',
								name: 'vipment',
								component: resolve => require(['../components/admin/operative/VipMent.vue'], resolve),
								meta: {
									requireAuth: true,
									title: 'VIP会员管理',
									pindex: '3',
									index: '15'
								}
							}, {
								path: 'addprice',
								name: 'addprice',
								component: resolve => require(['../components/admin/operative/VipMent/addprice.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '新增价格',
									pindex: '3',
									index: '15'
								}
							}, {
								path: 'editprice/:id',
								name: 'editprice',
								component: resolve => require(['../components/admin/operative/VipMent/addprice.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '编辑价格',
									pindex: '3',
									index: '15'
								}
							}]
						},
						//讲师信息管理
						{
							path: 'instment',
							component: parentComponent,
							meta: {
								requireAuth: true,
							},
							children: [{
								path: '',
								name: 'instment',
								component: resolve => require(['../components/admin/operative/InstMent.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '讲师信息管理',
									pindex: '3',
									index: '16'
								}
							}, {
								path: 'addins',
								name: 'addins',
								component: resolve => require(['../components/admin/operative/InstMent/addins.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '新增讲师',
									pindex: '3',
									index: '16'
								}
							}, {
								path: 'editins/:id',
								name: 'editins',
								component: resolve => require(['../components/admin/operative/InstMent/addins.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '编辑讲师',
									pindex: '3',
									index: '16'
								}
							}]
						},
						//教务设置
						{
							path: 'eduset',
							component: parentComponent,
							meta: {
								requireAuth: true,
							},
							children: [{
									path: '',
									name: 'eduset',
									component: resolve => require(['../components/admin/systemset/EduSet.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '教务设置',
										pindex: '3',
										index: '24'
									}
								},
								{
									path: 'add_template',
									name: 'add_template',
									component: resolve => require(['../components/admin/systemset/EduSet/addTemplate.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '新增模板',
										pindex: '3',
										index: '24'
									}
								},
								{
									path: 'edit_template/:id',
									name: 'edit_template',
									component: resolve => require(['../components/admin/systemset/EduSet/addTemplate.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '编辑模板',
										pindex: '3',
										index: '24'
									}
								}
							]
						},
						//主页信息管理
						{
							path: 'hoinfment',
							name: 'hoinfment',
							component: resolve => require(['../components/admin/operative/HoinfMent.vue'], resolve),
							meta: {
								requireAuth: true,
								title: '主页信息管理',
								pindex: '3',
								index: '17'
							}
						},
						//公众号管理
						{
							path: 'pubnument',
							name: 'pubnument',
							component: resolve => require(['../components/admin/operative/pubnument.vue'], resolve),
							meta: {
								requireAuth: true,
								title: '公众号管理',
								pindex: '3',
								index: '18'
							}
						},
						//会销管理
						{
							path: 'SaleMent',
							component: parentComponent,
							meta: {
								requireAuth: true,
							},
							children: [{
								path: '',
								name: 'SaleMent',
								component: resolve => require(['../components/admin/operative/SaleMent.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '会销管理',
									pindex: '3',
									index: '26'
								}
							}, {
								path: 'addSale',
								name: 'addSale',
								component: resolve => require(['../components/admin/operative/SaleMent/addSale.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '新增会议',
									pindex: '3',
									index: '26'
								}
							}, {
								path: 'manageSale/:id',
								name: 'manageSale',
								component: resolve => require(['../components/admin/operative/SaleMent/manageSale.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '管理会议',
									pindex: '3',
									index: '26'
								}
							}, {
								path: 'editSale',
								name: 'editSale',
								component: resolve => require(['../components/admin/operative/SaleMent/addSale.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '编辑会议',
									pindex: '3',
									index: '26'
								}
							}, {
								path: 'signMent/:id',
								name: 'signMent',
								component: resolve => require(['../components/admin/operative/SaleMent/signMent.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '签到管理',
									pindex: '3',
									index: '26'
								}
							}, {
								path: 'editSign/:id',
								name: 'editSign',
								component: resolve => require(['../components/admin/operative/SaleMent/signMent/editSign.vue'], resolve),
								meta: {
									requireAuth: true,
									title: '修改签到信息',
									pindex: '3',
									index: '26'
								}
							}]
						},
					]
				},
				// 用户
				{
					path: 'Userment',
					name: 'Userment',
					component: parentComponent,
					meta: {
						requireAuth: true,
					},
					children: [{
						path: 'user',
						component: parentComponent,
						meta: {
							requireAuth: true,

						},
						children: [{
							path: '',
							name: 'user',
							component: resolve => require(['../components/admin/user/UserMent.vue'], resolve),
							meta: {
								requireAuth: true,
								title: '用户管理',
								pindex: '4',
								index: '19'
							}
						}, {
							path: 'add_label',
							name: 'add_label',
							component: resolve => require(['../components/admin/user/UserMent/addLabel.vue'], resolve),
							meta: {
								requireAuth: true,
								title: '添加组',
								pindex: '4',
								index: '19'
							}
						}, {
							path: 'edit_label/:id',
							name: 'edit_label',
							component: resolve => require(['../components/admin/user/UserMent/addLabel.vue'], resolve),
							meta: {
								requireAuth: true,
								title: '编辑组',
								pindex: '4',
								index: '19'
							}
						}, {
							path: 'EditUser/:id',
							name: 'EditUser',
							component: resolve => require(['../components/admin/user/UserMent/EditUser.vue'], resolve),
							meta: {
								requireAuth: true,
								title: '修改用户信息',
								pindex: '4',
								index: '19'
							}
						}]
					}]
				},
				// 订单
				{
					path: 'order',
					name: 'order',
					component: resolve => require(['../components/admin/order/OrderMent.vue'], resolve),
					meta: {
						requireAuth: true,
						title: '订单管理',
						pindex: '5',
						index: '20'
					}
				},
				//系统设置
				{
					path: 'system',
					name: 'system',
					component: parentComponent,
					meta: {
						requireAuth: true,
					},
					children: [
						//权限管理
						{
							path: 'rbacment',
							component: parentComponent,
							meta: {
								requireAuth: true,

							},
							children: [{
									path: '',
									name: 'rbacment',
									component: resolve => require(['../components/admin/systemset/RbacMent.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '权限管理',
										pindex: '6',
										index: '21'
									},
								},
								{
									path: 'add_rbac',
									name: 'add_rbac',
									component: resolve => require(['../components/admin/systemset/RbacMent/addRbac.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '新增权限',
										pindex: '6',
										index: '21'
									},
								},
								{
									path: 'edit_rbac/:id',
									name: 'edit_rbac',
									component: resolve => require(['../components/admin/systemset/RbacMent/addRbac.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '编辑权限',
										pindex: '6',
										index: '21'
									},
								}
							]
						},
						//角色管理
						{
							path: 'rolement',
							component: parentComponent,
							meta: {
								requireAuth: true,
							},
							children: [{
									path: '',
									name: 'rolement',
									component: resolve => require(['../components/admin/systemset/RoleMent.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '角色管理',
										pindex: '6',
										index: '22'
									},
								},
								{
									path: 'add_role',
									name: 'add_role',
									component: resolve => require(['../components/admin/systemset/RoleMent/addRole.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '新增角色',
										pindex: '6',
										index: '22'
									},
								},
								{
									path: 'edit_role/:id',
									name: 'edit_role',
									component: resolve => require(['../components/admin/systemset/RoleMent/addRole.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '编辑角色',
										pindex: '6',
										index: '22'
									},
								}
							]
						},
						//账号管理
						{
							path: 'accment',
							component: parentComponent,
							meta: {
								requireAuth: true,
							},
							children: [{
									path: '',
									name: 'accment',
									component: resolve => require(['../components/admin/systemset/AccMent.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '账号管理',
										pindex: '6',
										index: '23'
									}
								},
								{
									path: 'add_account',
									name: 'add_account',
									component: resolve => require(['../components/admin/systemset/AccMent/addAccount.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '新建账号',
										pindex: '6',
										index: '23'
									}
								},
								{
									path: 'edit_account/:id',
									name: 'edit_account',
									component: resolve => require(['../components/admin/systemset/AccMent/addAccount.vue'], resolve),
									meta: {
										requireAuth: true,
										title: '编辑账号',
										pindex: '6',
										index: '23'
									}
								}
							]
						},

						//系统操作日志
						{
							path: 'syslog',
							name: 'syslog',
							component: resolve => require(['../components/admin/systemset/SysLog.vue'], resolve),
							meta: {
								requireAuth: true,
								title: '系统操作日志',
								pindex: '6',
								index: '25'
							}
						},
						//通用设置
						{
							path: 'CurrencyMent',
							name: 'CurrencyMent',
							component: resolve => require(['../components/admin/systemset/CurrencyMent.vue'], resolve),
							meta: {
								requireAuth: true,
								title: '通用设置',
								pindex: '6',
								index: '27'
							}
						},
					]
				},
			]
		},
		{
			path: '/login',
			name: 'login',
			component: resolve => require(['../components/admin/login/login.vue'], resolve),
			meta: {
				requireAuth: false,
			}
		}
	]
})