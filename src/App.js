import * as React from 'react';
import { Layout, message, Button, Icon } from 'antd';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import Dashboard from './components/dashboard';
import NewPost from './components/posts/new';
import EditPost from './components/posts/edit'
import PostList from './components/posts/index';
import PostDetail from './components/posts/show';
import Login from './components/user/login';
import Register from './components/user/register';
import UserIndex from './components/user/index';
import AvatarCommon from './components/common/avatar';
import UserList from './components/admin/user/index';
import UserMobx from './mobx/user';
import AppMobx from './mobx/app';
import { observer } from 'mobx-react';
import './App.less';

window.message = message

const { Header, Content, Footer } = Layout;

@observer
class App extends React.Component {

  render() {
    const { app } = AppMobx
    const { user } = UserMobx
    return (
      <Router>
        <Layout>
          <Header className={app.head_fixed ? 'headerFixed' : ''}>
            <NavLink className={'navLink'} to={'/'}>
              <span className={'PeterLogo'}> 
                Peter 
                <span style={{color: 'red'}}>&nbsp;Blog</span>
              </span>
            </NavLink>
            <NavLink className={'navLink'} to={'/'}>首页</NavLink>
            <NavLink className={'navLink'} to={'/posts'}>文章</NavLink>
            <NavLink className={'navLink pull-right'} to={user.status === null ? '/user/login' : '/user/index'}>{
              UserMobx.user.status === null ? '登录' : <AvatarCommon user={user} />
            }</NavLink>
            <NavLink className={'navLink pull-right'} to={'/posts/new'}>
              <Button  type={'primary'} icon={'edit'} ghost>写文章</Button>
            </NavLink>
           
          </Header>
          <Content className={app.head_fixed ? 'contentFixed' : ''}>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/posts" component={PostList} />
              <Route exact path="/posts/new" component={NewPost} />
              <Route exact path="/posts/:id" component={PostDetail} />
              <Route exact path="/posts/edit/:id" component={EditPost} />
              <Route exact path="/user/login" component={Login} />
              <Route exact path="/user/register" component={Register} />
              <Route exact path="/user/index" component={UserIndex} />
              <Route exact path="/admin/users" component={UserList} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Peter Blog ©2018 Created by Peter.Ji
          </Footer>
        </Layout>
      </Router>
    );
  }
}

export default App;
