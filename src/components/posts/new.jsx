import * as React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { createNewPost } from '../../config/api';
import { Redirect } from 'react-router';
import PostMobx from '../../mobx/post';
import AppMobx from '../../mobx/app';
import { observer } from 'mobx-react';
import PostForm from './_form'

@observer
class NewPost extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: PostMobx.post.lastTitle,
			content: PostMobx.post.lastContent,
			category_id: null,
			saveSuccess: false,
			id: null
		}
	}

	componentDidMount() {
		AppMobx.app.head_fixed = false
	}

	componentWillUnmount() {
		AppMobx.app.head_fixed = true
	}

	onChangeContent = content => {
		this.setState({ content });
		PostMobx.post.lastContent = content
		return content;
	}

	onChangeTitle = e => {
		PostMobx.post.lastTitle = e.target.value
		this.setState({ title: e.target.value })
	}

	onChangeCategory = category_id => {
		this.setState({category_id})
	}

	onSubmit = () => {
		const { title, content, category_id } = this.state
		let post = {
			title: title,
			content: content,
			category_id: category_id
		}

		createNewPost(post).then((result) => {
			if (result.success === true) {
				PostMobx.refresh()
				this.setState({saveSuccess: true, id: result.data.id})
			} else {
				window.message.error(result.err)
			}
		}).catch((err) => {
			if (err === 405) {
				window.message.error('请先登录系统后再提交，您的文章会暂时被保存')
			}
		})
	}

	render() {
		const { content, saveSuccess, id, title } = this.state
		if (saveSuccess === true) {
			return <Redirect to={`/posts/${id}`} />
		} else {
			return (
				<PostForm 
					title={title} 
					content={content} 
					onChangeCategory={this.onChangeCategory}
					onChangeTitle={this.onChangeTitle}
					onChangeContent={this.onChangeContent}
					onSubmit={this.onSubmit} 
				/>
			);
		}
	}
}

export default NewPost;
