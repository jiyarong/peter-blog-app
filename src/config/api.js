//默认的GET Header
import userMobx from '../mobx/user';

let token = () => {
	return userMobx.user.token
}
var OSS = require('ali-oss/dist/aliyun-oss-sdk.min.js')
export var client = new OSS.Wrapper({
	accessKeyId: 'LTAIchDyb5UpU9sq',
	accessKeySecret: 'qV8ENn0CBeJ0RoIPvL2G9ZuPkk8fhs',
	bucket: 'peter-blog',
	endpoint: 'https://oss-cn-beijing.aliyuncs.com'
});

const _GET_ = () => {
	return {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'token': token()
		}
	}
}

//默认的POST Header
const _POST_ = (body) => {
	return (
		{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'token': token()
			},
			body: JSON.stringify(body)
		}
	)
}

//默认的PUT Header
const _PUT_ = (body) => {
	return (
		{
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'token': token()
			},
			body: JSON.stringify(body)
		}
	)
}

//默认的PUT Header
const _DELETE_ = () => {
	return (
		{
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'token': token()
			}
		}
	)
}

//通用的请求生成器
class Requester {

	constructor(header = {}, url) {
		// this.host = 'http://u1c2g:7001/api'
		//this.host = 'http://blog.peterji.cn:7001/api'
		//this.host = 'http://localhost:7001/api'
		this.host = 'https://api.peterji.cn/api'
		this.url = url
		this.header = header
	}

	do_fetch() {
		return new Promise((resolve, reject) => {
			let timeout = setTimeout(() => { reject("请求超时") }, 20000)
			let _url = `${this.host}${this.url}`
			console.log('_url', _url)
			fetch(_url, this.header).then((response) => {
				clearTimeout(timeout)
				if (response.status.toString().match(/^2.*/)) {
					return response.json()
				} else if (response.status.toString() === '405') {
					userMobx.logout()
					return reject(response.status)
				} 
				else {
					return reject(response.status)
				}
			}).then((responseData) => {
				return resolve(responseData)
			}).catch((error) => {
				return reject(error)
			})
		})
	}
}

export const updateAliyunOss = (file, nameProxy='file') => {
	return new Promise((res, rej) => {
		let reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onload = async (fileEvent) => {
			var date = new Date()
			var storeAs = `Uploads/${nameProxy}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${date.getTime()}.${file.name.split(".").pop()}`
		
			// arrayBuffer转Buffer
			var buffer = new OSS.Buffer(fileEvent.target.result);
	
			// 上传
			client.put(storeAs, buffer)
			.then(function (result) {
				console.log(result)
				res(result.url)
			}).catch(function (err) {
				rej(err)
			});
		}
	})
}

export const userRegister = (user) => {
	return new Requester(_POST_(user), `/users/register`).do_fetch()
}

export const userGetCode = (email) => {
	return new Requester(_GET_(), `/users/get_validate_code?email=${email}`).do_fetch()
}

export const userLogin = (user) => {
	return new Requester(_POST_(user), '/users/login').do_fetch()
}

export const userUpdateInfo = (user) => {
	return new Requester(_POST_(user), '/users/update_avatar').do_fetch()
}

export const getPostList = (page=1, tab='', per_page=20) => {
	return new Requester(_GET_(), `/posts?page=${page}&tab=${tab}&per_page=${per_page}`).do_fetch()
}

export const fetchCategories = () => {
	return new Requester(_GET_(), '/categories').do_fetch()
}

export const createNewPost = (post) => {
	return new Requester(_POST_(post), '/posts').do_fetch()
}

export const updatePost = (id, post) => {
	return new Requester(_PUT_(post), `/posts/${id}/update`).do_fetch()
}

export const getPostDetail = (id, with_comment=true) => {
	return new Requester(_GET_(), `/posts/${id}?with_comment=${with_comment}`).do_fetch()
}

export const destroyPost = (id) => {
	return new Requester(_DELETE_(), `/posts/${id}`).do_fetch()
}

export const addNewComment = (comment) => {
	return new Requester(_POST_(comment), '/comments').do_fetch()
}

export const getUserList = (page=1) => {
	return new Requester(_GET_(), `/users?page=${page}`).do_fetch()
}

export const updateUser = (id, user) => {
	return new Requester(_PUT_(user), `/users/${id}`).do_fetch()
}

export const getRecentPosts = (user_id=null) => {
	return new Requester(_GET_(), `/posts/recent_posts?user_id=${user_id}`).do_fetch()
}

