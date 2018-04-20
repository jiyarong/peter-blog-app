import * as React from 'react';
import { Spin, List, Tag, Card } from 'antd';
import { Link } from 'react-router-dom';
import timeLabel from '../../lib/timeLabel';
import InfiniteScroll from 'react-infinite-scroller';
import { observer } from 'mobx-react';
import postMobx from '../../mobx/post';
import userMobx from '../../mobx/user'
import AvatarCommon from '../common/avatar';

@observer
class PostList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			data: [],
			currentPage: 1,
			hasMore: true,
			initializing: true
		}
	}

	postItem = (post) => {
		let { user, category } = post
		if (category == undefined) { category = { name: '垃圾' } }
		return (
			<div className={'postItem'}>
				<div className={'postItemAvatar'}>
					<AvatarCommon user={user} />
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

	handleInfiniteOnLoad = (page) => {
		const { initializing, loading } = postMobx.post
		if (initializing || loading) return
		postMobx.flip(page)
	}

	tabChange = (key) => {
		postMobx.tabChange(key)
	}

	render() {
		const { loading, data, hasMore, categories , tab , status} = postMobx.post
		let tablist = [
			{key: '', tab: '全部'}
		]
		if (userMobx.user.status !== null) {
			tablist.push({key: '-1', tab: '我的'})
		}
		categories.forEach((c, i) => {
			tablist.push({
				key: c.id,
				tab: c.name
			})
		})

		return (
			<Card className={'postListContainer'} tabList={tablist} activeTabKey={tab} onTabChange={this.tabChange}>
				<InfiniteScroll
					initialLoad={false}
					pageStart={0}
					loadMore={this.handleInfiniteOnLoad}
					hasMore={!loading && hasMore}
				>
					<List
						dataSource={data}
						renderItem={this.postItem}
						bordered
					/>
				</InfiniteScroll>
				<Spin size={'large'} spinning={loading} />
			</Card>
		)
	}
}

export default PostList