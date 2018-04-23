import * as React from 'react'
import { getPostDetail, addNewComment } from '../../config/api'
import ReactMarkDown from 'react-markdown'
import CodeBlock from './code-block'
import { Link } from 'react-router-dom'
import { Spin, Card, Button, Icon } from 'antd'
import Avatar from '../common/avatar'
import Editor from '../common/editor'
import userMobx from '../../mobx/user'
import AppMobx from '../../mobx/app';
import timeLabel from '../../lib/timeLabel';

class PostDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: props.match.params.id,
			loading: true,
			data: {},
			currentComment: {
				commentable_id: props.match.params.id,
				commentable: 'post',
				content: ''
			}
		}
	}

	componentDidMount() {
		AppMobx.app.head_fixed = false
		this.getPost()
	}

	componentWillUnmount() {
		AppMobx.app.head_fixed = true
	}

	onChangeComment = content => {
		let { currentComment } = this.state
		currentComment.content = content
		this.setState({ currentComment });
		return content;
	}

	getPost = () => {
		getPostDetail(this.state.id).then((result) => {
			this.setState({ data: result.data, loading: false })
		})
	}

	onSubmitComment = () => {
		let { currentComment } = this.state
		if (currentComment.content.length === 0) {
			window.message.error('评论不能为空')
			return
		}

		addNewComment(currentComment).then((result) => {
			if (result.success === true) {
				window.message.success('评论成功')
				currentComment.content = ''
				this.setState({
					currentComment: currentComment
				})
				this.getPost()
			}
		})
	}

	replyComment = (user, floor) => {
		let { currentComment } = this.state
		currentComment.content = `> 对 @${user.name} #${floor} 回复\r\r`
		this.setState({ currentComment });
	}

	commentTemplate = (comment, index) => {
		const { creator } = comment
		return (
			<div key={index} className={'comment'}>
				<Avatar user={creator} />
				<div className={'commentContentContainer'}>
					<div>{creator.name} #{index + 1} 回复于: {timeLabel(comment.created_at)}</div>
					<ReactMarkDown source={comment.content} renderers={{ code: CodeBlock }} />
				</div>
				<Button onClick={() => this.replyComment(creator, index + 1)}>
					<Icon type="rollback" />
				</Button>
			</div>
		)
	}

	render() {
		const { loading, data, currentComment } = this.state
		const { user, comments } = data
		if (loading === true) {
			return <div>正在加载数据...</div>
		} else {
			return (
				<div>
					<Card
						title={
							<div className={'postDetailTitle'}>
								<div className={'postTitleInfo'}>
									<h1>{data.title}</h1>
									<Avatar user={user} />
									{
										data.user_id === userMobx.user.id ? 
											<Link to={`/posts/edit/${data.id}`}>
												<Icon type={'edit'} style={{fontSize: '25px', paddingLeft: '10px'}}/>
											</Link> 
											: null
									}
								</div>
								<div>
									<span>{user.name}</span>
								</div>
							</div>
						}
					>
						<div className={'postContent'} >
							<ReactMarkDown source={data.content} renderers={{ code: CodeBlock }} />
						</div>
					</Card>
					<Card className={'postComments'} title={`回复: (${comments.length})`}>
						<div className={'postCommentContainer'}>
							{
								comments.map((c, index) => {
									return this.commentTemplate(c, index)
								})
							}
						</div>
					</Card>
					<Card title={'添加回复'} className={'postAddComment'}>
						<Editor
							value={currentComment.content}
							onChange={this.onChangeComment}
							style={{ margin: "0 auto", width: '100%', height: '300px' }}
						/>
						<Button
							type="primary"
							onClick={this.onSubmitComment}
							style={{ width: '100%', marginTop: '20px' }}
						>
							提交
						</Button>
					</Card>
				</div>
			)
		}
	}
}

export default PostDetail