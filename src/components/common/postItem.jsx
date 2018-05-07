import * as React from 'react';
import timeLabel from '../../lib/timeLabel';
import AvatarCommon from './avatar';
import { Tag } from 'antd';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

@observer
class PostItem extends React.Component {
  render() {
    const { post } = this.props

    let { user, category } = post
		if (category === null || category === undefined) { category = { name: '垃圾' } }
    return(
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
}

export default PostItem