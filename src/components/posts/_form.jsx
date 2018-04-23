import * as React from 'react';
import { Form, Input, Button, Select } from 'antd';
import Editor from '../common/editor';
import PostMobx from '../../mobx/post';
import { observer } from 'mobx-react';
const Option = Select.Option;

@observer
class PostForm extends React.Component {
  static defaultProps = {
    categoty_id: null,
    onChangeCategory: () => {},
    onChangeTitle: () => {},
    onChangeContent: () => {},
    title: null,
    content: null,
    onSubmit: () => {}
  }

  render() {
    const {
      category_id,
      onChangeCategory,
      onChangeTitle,
      onChangeContent,
      title,
      content,
      onSubmit
    } = this.props
    return (
      <div className="post-form">
        <Form layout={'horizontal'} >
          <Form.Item>
            <Select placeholder={'选择一个类别'} onChange={onChangeCategory} defaultValue={category_id}>
              {PostMobx.post.categories.map((c, index) => {
                return (
                  <Option key={index} value={c.id}>{c.name}</Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item>
            <Input value={title} placeholder="在此输入标题" onChange={onChangeTitle} />
          </Form.Item>
          <Form.Item>
            <Editor
              value={content}
              onChange={onChangeContent}
              style={{ margin: "0 auto", width: '100%' }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={onSubmit} style={{ width: '100%' }}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default PostForm