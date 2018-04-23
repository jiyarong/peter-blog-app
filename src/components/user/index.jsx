import * as React from 'react';
import { Upload, message, Collapse, Button, List, Tag } from 'antd';
import { updateAliyunOss, getRecentPosts } from '../../config/api';
import { Redirect, Link } from 'react-router-dom';
import userMobx from '../../mobx/user';
import { observer } from 'mobx-react';
import AvatarCommon from '../common/avatar'
import timeLabel from '../../lib/timeLabel'

const Dragger = Upload.Dragger;
const Panel = Collapse.Panel;

@observer
class UserIndex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: userMobx.user.name,
			avatar: userMobx.user.avatar,
			login_exoired: false,
			recentPosts: []
		}
	};

	componentDidMount() {
		getRecentPosts().then((result) => {
			if (result.success === true) {
				this.setState({
					recentPosts: result.data
				})
			}
		})
	}

	//这里有个bug，customRequest无法和async await一起使用，用promise
	uploadAvatar = (e) => {
		updateAliyunOss(e.file, 'avatar').then((url) => {
			userMobx.updateInfo({avatar_url: url}).then((result) => {
				if (result === true) {
					message.success('更换成功')
				} else {
					message.error('更换失败')
				}
			})
		})	
	}

	getRecentPost = (keys) => {
		if (keys.includes('recentPost')) {
			getRecentPosts().then((result) => {
				if (result.success === true) {
					this.setState({
						recentPosts: result.data
					})
				}
			})
		}
	}

	rootOperates = () => {
		return (
			<div style={{display: 'inline'}}>
				<Link to="/admin/users">
					<Button type="danger" >用户列表</Button>
				</Link>
				<Button type="danger" >投票列表</Button>
				<Button type="danger" >站点设置</Button>
			</div>
		)
	}

	logout = () => {
		userMobx.logout();
		this.setState({ login_exoired: true })
	}		

	recentPostList = (post) => {
		let { category } = post
		if (category == undefined) { category = { name: '垃圾' } }
		return (
			<div className={'postItem'}>
				<div className={'postItemAvatar'}>
					<AvatarCommon user={userMobx.user} />
				</div>
				<div className={'postItemCategory'}>
					<Tag color={'green'}>{category.name}</Tag>
				</div>
				<div className={'postItemTitle'}>
					<Link to={`/posts/${post.id}`} >
						{post.title}
					</Link>
				</div>
				<div className={'postItemUpdatedAt'}>{timeLabel(post.updated_at)}</div>
			</div>
		)
	}

	render() {
		const { name, login_exoired, recentPosts } = this.state
		const { user } = userMobx
		if (login_exoired === true) {
			return <Redirect to={`/user/login`} />
		}
		return (
			<div>
				<Collapse defaultActiveKey={['baseInfo', 'recentPosts']} onChange={this.getRecentPost}>
					<Panel header="基本信息" key="baseInfo">
						<table className={'tableUserInfo'}>
							<tbody>
								<tr>
									<th>用户名:</th>
									<td>{name}</td>
								</tr>
								<tr>
									<th>头像:</th>
									<td>
										<Dragger accept={'image/*'} showUploadList={false} name='file' multiple={false} customRequest={this.uploadAvatar}>
											<AvatarCommon user={user} />
											<p>点击此处或将图片拖到此处更新头像</p>
										</Dragger>
									</td>
								</tr>
								<tr>
									<th>身份:</th>
									<td>{user.role || '游客'}</td>
								</tr>
								<tr>
									<th>操作:</th>
									<td>
										<Button onClick={this.logout} type="primary" >退出登录</Button>
										&nbsp;
										<Button type="primary" >修改密码</Button>
										&nbsp;
										{
											user.role === '管理员' ? this.rootOperates() : null
										}
									</td>
								</tr>
							</tbody>
						</table>
					</Panel>
					<Panel header="最近的文章" key="recentPosts">
						<List dataSource={recentPosts} renderItem={this.recentPostList} />				
					</Panel>
					<Panel header="最近的评论" key="recentComments">
						test
					</Panel>
				</Collapse>
			</div>
		)
	}
}

export default UserIndex