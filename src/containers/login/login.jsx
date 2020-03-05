/*
用户登录的路由组件
 */
import React, { Component } from 'react'
import { InputItem, Button } from 'antd-mobile'
export default class Login extends Component {
	state = {
		userName: '',
		password: ''
	};
	onChange = (name, v) => {
		this.setState({[name]: v});
	};
	login = () => {
		console.log(this.state)
	};
	render() {
		return (
			<div>
				<InputItem
					clear
					onChange={(v) => this.onChange('userName', v)}
					placeholder="请输入您的账号"
				>账号</InputItem>
				<InputItem
					clear
					onChange={(v) => this.onChange('password', v)}
					placeholder="请输入您的密码"
				>密码</InputItem>
				<div>
					<Button onClick={ this.login }>登录</Button>
				</div>
			</div>
		)
	}
}
