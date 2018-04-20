import * as React from 'react'
import userMobx from '../../../mobx/user'
import { Redirect } from 'react-router-dom'
import { getUserList, updateUser } from '../../../config/api'
import { List, Card, Button, Pagination } from 'antd'
import Avatar from '../../common/avatar'
import timeLabel from '../../../lib/timeLabel'

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: userMobx.user.role === '管理员',
      page: 1,
      loading: true,
      data: [],
      total: 100
    }
  }

  componentDidMount() {
    this.getUsers()
  }

  setRole = (user_id, role) => {
    updateUser(user_id, {role: role}).then((result) => {
      if (result.success === true) {
        let _data = this.state.data
        let user = _data.filter((u) => {
          return u.id === user_id
        })[0]
        user.role = role
        this.setState({data: _data})
      }
    }).catch((err) => {
      if (err === 405) {
        this.setState({hasPermission: false})
      }
    })
  }

  getUsers = () => {
    getUserList(this.state.page).then((result) => {
      if (result.success === true) {
        this.setState({
          data: result.data.rows,
          loading: false,
          total: result.data.count
        })
      }
    })
  }

  userItem = (user) => {
    let role = user.role === '管理员' ? '管理员' : '游客'
    let set_role = user.role === '管理员' ? '游客' : '管理员'
    let active = {1: '可用', 0: '不可用'}[user.active]
    return (
      <div className={'adminUser'}>
        <div><Avatar user={user} /></div>
        <div>{user.name}</div>
        <div>{role}</div>
        <div>{active}</div>
        <div>{timeLabel(user.created_at)}</div>
        <div>
          <Button type={'primary'} onClick={() => {this.setRole(user.id, set_role)}}>
            设置为{`${set_role}`}
          </Button>
        </div>
      </div>
    )
  }

  flip = (page) => {
    this.setState({page: page}, () => {
      this.getUsers()
    })
  }

  render() {
    const { hasPermission, loading, data, page, total } = this.state

    if (hasPermission === false) {
      window.message.error('你没有权限访问该页面')
      return <Redirect to={'/'} />
    } else if (loading === true) {
      return (
        <div>正在加载...</div>
      )
    } else {
      return (
        <Card title={'用户列表'} className={'adminUserList'}>
          <Pagination current={page} pageSize={20} total={total} onChange={this.flip} />
          <List dataSource={data} renderItem={this.userItem}/>
        </Card>
      )
    }
  }
}

export default UserList