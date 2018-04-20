import * as React from 'react';
import { Form, Icon, Input, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import userMobx from '../../mobx/user';
import { Redirect } from 'react-router';

const FormItem = Form.Item;

@observer
class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			password: '',
			passwordConfirm: '',
			registerSuccess: false
		}
	}

	onChangeUsername = (txt) => {
		this.setState({ name: txt.target.value })
	}

	onChangePassword = (txt) => {
		this.setState({ password: txt.target.value })
	}

	onChangePasswordConfirm = (txt) => {
		this.setState({ passwordConfirm: txt.target.value })
	}

	submit = async () => {
		const { name, passwordConfirm, password } = this.state
		let user = {
			name: name,
			password: password,
			passwordConfirm: passwordConfirm
		}
		const result = await userMobx.register(user)
		if (result === true) {
			this.setState({ registerSuccess: true })
		}
	}

	render() {
		const { registerSuccess } = this.state
		if (registerSuccess === true) {
			return <Redirect to={"/"} />
		} else {
			return (
				<Row>
					<Col span={8} />
					<Col span={8}>
						<Form className="loginForm">
							<div style={{ textAlign: 'center' }}>
								<h2>注册账号</h2>
							</div>
							<FormItem>
								<Input
									onChange={this.onChangeUsername}
									prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="用户名" />
							</FormItem>
							<FormItem>
								<Input
									onChange={this.onChangePassword}
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
									type="password"
									placeholder="密码" />
							</FormItem>
							<FormItem>
								<Input
									onChange={this.onChangePasswordConfirm}
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
									type="password"
									placeholder="确认密码" />
							</FormItem>
							<FormItem>
								<Button type="primary" onClick={this.submit} className="login-form-button pull-right">注册</Button>
							</FormItem>
							<FormItem style={{ textAlign: 'center' }}>
								<Link to="/user/login" >已有账号，登录</Link>
							</FormItem>
						</Form>
					</Col>
					<Col span={8} />
				</Row>
			)
		}
	}
}

export default Register