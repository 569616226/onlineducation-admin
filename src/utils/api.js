import request from './request'
import apiUrl from './apiUrl'
const api_url = apiUrl
const api = {
	//标签列表
	getGenreLists: () => request.get(`${api_url}/admin/genre/lists`),
	//新建标签
	postGenre: (name) => request.post(`${api_url}/admin/genre`,{
		name: name
	}),
	//删除标签
	deleteGenre: (id) => request.get(`${api_url}/admin/genre/${id}/delete`),
	//编辑标签
	editGenre: (id, name) => request.post(`${api_url}/admin/genre/${id}/update`,{
		name: name
	}),
	//分类排序
	ChangeNavOrder: (nav_datas) => request.post(`${api_url}/admin/nav/change_nav_order`,{
		nav_datas: nav_datas
	}),
	//会议列表
	getTrainLists: () => request.get(`${api_url}/admin/train/lists`),
	//分类列表
	getNavLists: () => request.get(`${api_url}/admin/nav/lists`),
	//会议详情
	getTrainDetail: (id) => request.get(`${api_url}/admin/train/${id}`),
	//下载签到二维码
	getDownloadQrcode: (id) => request.get(`${api_url}/admin/train/${id}/download_qrcode`),
	//签到列表
	getSignLists: (id) => request.get(`${api_url}/admin/sign/${id}/lists`),
	//讲师列表
	getTeacherLists: () => request.get(`${api_url}/admin/teacher/lists`),
	//课程详情
	getLessonDetail: (id) => request.get(`${api_url}/admin/lesson/${id}`),
	//编辑课程播放数据
	editOutPlayTimes: (id, out_play_times) => request.post(`${api_url}/admin/lesson/${id}/set_out_play_times`,{
		out_play_times: out_play_times
	}),
	//编辑课程点赞数据
	editOutLike: (id, out_like) => request.post(`${api_url}/admin/lesson/${id}/set_out_like`,{
		out_like: out_like
	}),
	//用户详情
	getGuestDetail: (id) => request.get(`${api_url}/admin/guest/${id}`),
	//角色列表
	getRoleLists: () => request.get(`${api_url}/admin/role/lists`),
	//web端上传视频签名
	getVideoSignature: () => request.get(`${api_url}/admin/video/get_video_signature`),
	//web端上传视频签名
	postVideo: (result) => request.post(`${api_url}/admin/video`, {
		fileId: result.fileId,
		videoName: result.videoName,
		videoUrl: result.videoUrl
	}),
	//首页设置数据
	getIndexType: (id) => request.get(`${api_url}/admin/setting/${id}/get_index_type`),
	//清除缓存
	getClearCache: () => request.get(`${api_url}/admin/cache/flushall`),
	//首页设置数据
	getDiscusse: (id, content) => request.post(`${api_url}/admin/discusse/${id}`, {
		content: content
	}),
}

export default api