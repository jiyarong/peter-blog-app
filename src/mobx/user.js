import { observable } from 'mobx';
import { userRegister, userLogin, userUpdateInfo } from '../config/api'
import { Promise } from 'core-js';
var crypto = require('crypto')

const defaultUser = {
	status: null,
	name: null,
	avatar_url: null,
	role: null,
	token: null
}

class UserMobx {
	@observable
	user = defaultUser

	register = (user) => new Promise((res, rej) => {
		userRegister(user).then((result) => {
			console.log(result)
			if (result.success === true) {
				res(true)
				const { data } = result
				this.loginSuccess(data)
			} else {
				res(result.err)
			}
		}).catch((err) => {
			console.log(err)
			rej(err)
		})
	})
		

	login = (user) => new Promise((res, rej) => {
		userLogin(user).then((result) => {
			if (result.success === true) {
				res(true)
				const { data } = result
				this.loginSuccess(data)
			} else {
				res(result.err)
			}
		}).catch((err) => {
			rej(err)
		})
	})
	
	loginSuccess = (data) => {
		this.user = data
		this.user.status = true
		this.save_to_local()
	}

	logout = () => {
		localStorage.removeItem('__token__')
		localStorage.removeItem('__userInfo__')
		this.user = defaultUser
	}

	save_to_local = () => {
		var cipher = crypto.createCipher('aes-256-cbc', this.user.token)
		var crypted = cipher.update(JSON.stringify(this.user), 'utf8', 'hex');
		crypted += cipher.final('hex');
		localStorage.setItem('__userInfo__', crypted)
		localStorage.setItem('__token__', this.user.token)
	}

	updateInfo = (update) => new Promise((res, rej) => {
		userUpdateInfo(update).then((result) => {
			if (result.success === true) {
				res(true)
				this.user = {
					...this.user,
					...result.data
				}

				this.save_to_local()
			} else {
				res(false)
			}
		}).catch((err) => {
			rej(err)
		})
	})

	constructor() {
		var key = localStorage.getItem('__token__')
		if (key === null) return
		var userInfo = localStorage.getItem('__userInfo__') 
		if (userInfo === null) return
		var decipher = crypto.createDecipher('aes-256-cbc', key)
		var dec = decipher.update(userInfo,'hex','utf8')
		dec += decipher.final('utf8')
		let info = JSON.parse(dec)
		this.user = info
	}
}

export default new UserMobx()