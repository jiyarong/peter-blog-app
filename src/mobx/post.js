import { observable } from 'mobx';
import { getPostList, fetchCategories } from '../config/api';

class PostMobx {
	@observable
	post = {
		data: [],
		currentPage: 1,
		per_page: 20,
		loading: true,
		hasMore: false,
		totalCount: 0,
		initializing: true,
		lastTitle: '',
		lastContent: '',
		categories: [],
		tab: ''
	}

	constructor () {
		this.getData();
		this.fetchCategory();
		setTimeout(() => {
			this.post.initializing = false
		}, 500)
	}

	flip = () => {
		this.post.currentPage += 1
		this.getData()
	}

	refresh = () => {
		this.post = {
			...this.post,
			data: [],
			currentPage: 1,
			per_page: 20,
			loading: true,
			hasMore: false,
			totalCount: 0,
			tab: ''
		}
		this.getData()
	}

	fetchCategory = () => {
		fetchCategories().then((result) => {
			if (result.success === true) {
				this.post = {
					...this.post,
					categories: result.data
				}
			}
		})
	}

	tabChange = (key) => {
		this.post = {
			...this.post,
			data: [],
			currentPage: 1,
			per_page: 20,
			loading: true,
			hasMore: false,
			totalCount: 0,
			tab: key
		}
		this.getData()
	}

	getData = () => {
		const { currentPage, data, per_page, tab } = this.post
		this.post.loading = true
		getPostList(currentPage, tab).then((result) => {
			let _data = data
			_data.push(...result.data.rows)
			this.post = {
				...this.post,
				data: _data,
				hasMore: result.data.rows.length === per_page,
				totalCount: result.data.count,
				loading: false
			}
		})
	}


}

export default new PostMobx();