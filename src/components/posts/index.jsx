import * as React from 'react';
import { Spin, List, Card } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { observer } from 'mobx-react';
import postMobx from '../../mobx/post';
import userMobx from '../../mobx/user'
import PostItem from '../common/postItem'

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

	handleInfiniteOnLoad = (page) => {
		const { initializing, loading } = postMobx.post
		if (initializing || loading) return
		postMobx.flip(page)
	}

	tabChange = (key) => {
		postMobx.tabChange(key)
	}

	render() {
		const { loading, data, hasMore, categories, tab } = postMobx.post
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
						renderItem={(post) => {return <PostItem post={post} />}}
						bordered
					/>
				</InfiniteScroll>
				<Spin size={'large'} spinning={loading} />
			</Card>
		)
	}
}

export default PostList