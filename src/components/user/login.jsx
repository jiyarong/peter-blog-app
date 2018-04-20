import * as React from 'react'
import { Form, Icon, Input, Button, Row, Col, message } from 'antd';
import { Link } from 'react-router-dom'
import userMobx from '../../mobx/user';
import { Redirect } from 'react-router';

const FormItem = Form.Item;

class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: userMobx.user.name,
			password: userMobx.user.password,
			loginSuccess: false
		}
	}

	login = async () => {
		const { name, password } = this.state
		let user = {
			name: name,
			password: password
		}
		const result = await userMobx.login(user)
		if (result === true) {
			message.success('登录成功')
			this.setState({loginSuccess: true})
		} else {
			message.error(result)
		}
	}

	render() {
		const {	loginSuccess } = this.state
		if (loginSuccess) {
			return <Redirect to={'/'} />
		} else {
			return (
				<Row>
					<Col span={8} />
					<Col span={8}>
						<Form className="loginForm">
							<div style={{ textAlign: 'center' }}>
								<h2>登录博客</h2>
							</div>
							<FormItem>
								<Input
									prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="Username"
									onChange={(txt) => this.setState({ name: txt.target.value })}
								/>
							</FormItem>
							<FormItem>
								<Input
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
									type="password"
									placeholder="Password"
									onChange={(txt) => this.setState({ password: txt.target.value })}
								/>
							</FormItem>
							<FormItem>
								<Button onClick={this.login} type="primary" htmlType="submit" className="login-form-button pull-right">登录</Button>
							</FormItem>
							<FormItem style={{ textAlign: 'center' }}>
								<Link to="/user/register" >注册新账号</Link>
							</FormItem>
						</Form>
					</Col>
					<Col span={8} />
				</Row>
	
			);
		}
		
	}
}

export default Login