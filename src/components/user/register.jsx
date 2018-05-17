import * as React from 'react';
import { Form, Icon, Input, Button} from 'antd';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import userMobx from '../../mobx/user';
import { Redirect } from 'react-router';
import { userGetCode } from '../../config/api'

const FormItem = Form.Item;

@observer
class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			registerSuccess: false,
			gettingCode: false,
			remainingTime: 30
		}
	}

	getCode = () => {
		const { form } = this.props
		const err = form.getFieldError('email')
		const email = form.getFieldValue('email')
		if (email === '' || email === undefined) {
			window.message.error('邮件不能为空')
			return
		}
		if (err !== undefined) { return false }
		if (this.state.gettingCode === true) { return false }

		this.setState({ gettingCode: true })
		this.loopCodeTime = setInterval(() => {
			if (this.state.remainingTime === 0) {
				this.setState({ gettingCode: false, remainingTime: 30 })
				clearInterval(this.loopCodeTime)
			} else {
				this.setState({ remainingTime: this.state.remainingTime - 1 })
			}
		}, 1000)

		userGetCode(email).then((result) => {
			if (result.success === true) {
				window.message.success('发送成功，请注意查收邮件')
			}
		})
	}

	compareToFirstPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback('两次密码输入不一致');
		} else {
			callback();
		}
	}


	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				userMobx.register(values).then((result) => {
					if (result === true) {
						this.setState({ registerSuccess: true })
					} else {
						window.message.error(result)
					}
				})
			}
		});
	}

	render() {
		const { registerSuccess, gettingCode, remainingTime } = this.state
		const { getFieldDecorator } = this.props.form;
		if (registerSuccess === true) {
			return <Redirect to={"/"} />
		} else {
			return (
				<Form onSubmit={this.handleSubmit} className="loginForm">
					<div style={{ textAlign: 'center' }}>
						<h2>注册账号</h2>
					</div>
					<FormItem>
						{getFieldDecorator('name', {
							rules: [{ required: true, message: '请输入用户名' }],
						})(
							<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: '请输入密码' }],
						})(
							<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('passwordConfirm', {
							rules: [{ required: true, message: '请确认密码' }, { validator: this.compareToFirstPassword }],
						})(
							<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="确认密码" />
						)}
					</FormItem>
					<FormItem>
						<div style={{ display: 'flex' }}>
							{getFieldDecorator('email', {
								rules: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入合法的邮件地址', }],
							})(
								<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱" />
							)}
							<Button disabled={gettingCode} type="primary" onClick={this.getCode} >{
								gettingCode ? remainingTime : '验证码'
							}</Button>
						</div>
					</FormItem>
					<FormItem>
						{getFieldDecorator('validate_code', {
							rules: [{ required: true, message: '请输入验证码' }],
						})(
							<Input prefix={<Icon type="code" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="验证码" />
						)}
					</FormItem>
					<FormItem>
						<Button type="primary" htmlType="submit" className="login-form-button pull-right">注册</Button>
					</FormItem>
					<FormItem style={{ textAlign: 'center' }}>
						<Link to="/user/login" >已有账号，登录</Link>
					</FormItem>
				</Form>
			)
		}
	}
}

export default Form.create()(Register);