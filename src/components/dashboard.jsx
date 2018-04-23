import * as React from 'react';
import { Card, List, Tag } from 'antd'
import { observer } from 'mobx-react';
import appMobx from '../mobx/app';
import { Link } from 'react-router-dom';
import AvatarCommon from '../components/common/avatar';
import timeLabel from '../lib/timeLabel';

@observer
class Dashboard extends React.Component {
	recentPostList = (post) => {
		let { category } = post
		if (category == undefined) { category = { name: '垃圾' } }
		return (
			<div className={'postItem'}>
				<div className={'postItemAvatar'}>
					<AvatarCommon user={post.user} />
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
		return (
			<div className={'homePage'}>
				<Card title={'最新文章'} className={'recentBlogs'}>
					<List dataSource={appMobx.app.recent_posts} renderItem={this.recentPostList} />
				</Card>
				<div className={'blogAndLinks'}>
					<Card title={'关于这个博客'} className={'aboutThisBlog'}>
						<p>
							这个Blog是我在闲暇之余搭载出来的
						</p>
						<p>
							这里不仅仅可以分享技术，
							也可以分享一些生活中有趣的事情，游戏啊，电影啊等等都可以在这里进行交流
						</p>
						<p>
							无论你是大神还是和我一样是个菜鸟，都来这里说点什么吧！
						</p>
					</Card>
					<Card title={'每日必逛'} className={''}>
						<a rel="noopener noreferrer" href="https://cnodejs.org/" target='_blank'>https://cnodejs.org</a>
						<br/>
						<a rel="noopener noreferrer" href="https://ruby-china.org/" target='_blank'>https://ruby-china.org</a>
						<br/>
						<a rel="noopener noreferrer" href="https://gocn.io/" target='_blank'>https://gocn.io</a>
						<br/>
						<a rel="noopener noreferrer" href="https://github.com/" target='_blank'>https://github.com</a>
						<br/>
						<a rel="noopener noreferrer" href="https://www.csdn.net/" target='_blank'>https://www.csdn.net</a>		
					</Card>
				</div>
			</div>
		)
	}
}

export default Dashboard