import * as React from 'react';
import { updatePost, getPostDetail } from '../../config/api';
import { Redirect } from 'react-router';
import PostMobx from '../../mobx/post';
import AppMobx from '../../mobx/app';
import { observer } from 'mobx-react';
import PostForm from './_form'

@observer
class EditPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      post: {},
      loading: true,
      saveSuccess: false
    }
  }

  componentDidMount() {
    AppMobx.app.head_fixed = false
    getPostDetail(this.state.id, false).then((result) => {
      if (result.success === true) {
        this.setState({ post: result.data, loading: false })
      }
    })
  }

  componentWillUnmount() {
    AppMobx.app.head_fixed = true
  }

  onChangeContent = content => {
    let _post = this.state.post
    _post.content = content
    this.setState({ post: _post });
    return content;
  }

  onChangeTitle = e => {
    PostMobx.post.lastTitle = e.target.value
    let _post = this.state.post
    _post.title = e.target.value
    this.setState({ post: _post })
  }

  onChangeCategory = category_id => {
    let _post = this.state.post
    _post.category_id = category_id
    this.setState({ post: _post })
  }

  onSubmit = () => {
    const { post } = this.state
    updatePost(post.id, post).then((result) => {
      if (result.success === true) {
        PostMobx.refresh()
        this.setState({ saveSuccess: true })
        window.message.success('更新成功！')
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
    let { post, saveSuccess, id, loading } = this.state
    let { title, content, category_id } = post
    if (loading === true) {
      return <div>正在加载数据...</div>
    } else if (saveSuccess === true) {
      return <Redirect to={`/posts/${id}`} />
    } else {
      return (
        <PostForm
          category_id={category_id}
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

export default EditPost;
