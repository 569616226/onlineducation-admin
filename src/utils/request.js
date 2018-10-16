import router from '@/router'
const Fly = require("flyio/dist/npm/fly")
const request = new Fly

request.interceptors.request.use((request) => {
	request.headers.Accept = 'application/json'
	request.headers.Authorization = 'Bearer ' + window.localStorage.getItem('jwt_token')
	return request
})

request.interceptors.response.use(
	(response, promise) => {
		return promise.resolve(response.data)
	},
	(err, promise) => {
		return promise.resolve()
	}
)

export default request