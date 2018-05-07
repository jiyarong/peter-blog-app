import * as React from 'react'
import { Avatar } from 'antd';

class AvatarCommon extends React.Component {
  static defaultProps = {
    user: {
      avatar_url: undefined,
      name: undefined
    }
  }

  render() {
    let { user } = this.props
    if (user === null) { user = {} }
    if (user.name === undefined) { user.name = 'u' }
    if (user.avatar_url === undefined || user.avatar_url === "") {
      return (
        <Avatar>{user.name[0].toUpperCase()}</Avatar>
      )
    } else {
      return <Avatar src={user.avatar_url} />
    }
  }
}

export default AvatarCommon