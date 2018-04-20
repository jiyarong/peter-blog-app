import * as React from 'react';
import { milkFileReader } from 'react-milkdown';
import { Form, Input, Button, Select } from 'antd';
import 'font-awesome/css/font-awesome.min.css';
import { createNewPost, updateAliyunOss } from '../../config/api'
import { Redirect, withRouter } from 'react-router';
import PostMobx from '../../mobx/post';
import AppMobx from '../../mobx/app';
import { observer } from 'mobx-react';
const Option = Select.Option

let blobReader = file => (
	new Promise(async (res, rej) => {
		let url = await updateAliyunOss(file)
		res(url);
	})
);

const Milk = milkFileReader(blobReader);

@observer
class NewPost extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: PostMobx.post.lastTitle,
			content: PostMobx.post.lastContent,
			category_id: null,
			formLayout: 'horizontal',
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
		const { content, formLayout, saveSuccess, id, title } = this.state
		const { categories } = PostMobx.post
		if (saveSuccess === true) {
			return <Redirect to={`/posts/${id}`} />
		} else {
			return (
				<div className="post-form">
					<Form layout={formLayout} >
						<Form.Item>
							<Select placeholder={'选择一个类别'} onChange={this.onChangeCategory}>
								{categories.map((c, index) => {
									return (
										<Option key={index} value={c.id}>{c.name}</Option>
									)
								} )}
							</Select>
						</Form.Item>
						<Form.Item>
							<Input value={title} placeholder="在此输入标题" onChange={this.onChangeTitle} />
						</Form.Item>
						<Form.Item>
							<Milk
								value={content}
								onChange={this.onChangeContent}
								style={{ margin: "0 auto", width: '100%' }}
							/>
						</Form.Item>
						<Form.Item>
							<Button type="primary" onClick={this.onSubmit} style={{ width: '100%' }}>
								保存
							</Button>
						</Form.Item>
					</Form>
				</div>
			);
		}
	}
}

export default withRouter(NewPost);
