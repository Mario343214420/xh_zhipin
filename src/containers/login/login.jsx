/*
用户登录的路由组件
 */
import React, { Component } from 'react'
import { InputItem, Button } from 'antd-mobile'
import Logo from '../../components/logo/logo'
import {connect} from 'react-redux'
import {Redirect} from 'react-router'
import {login} from '../../redux/actions'
class Login extends Component {
	state = {
		username: '',
		password: ''
	};
	onChange = (name, v) => {
		this.setState({[name]: v});
	};
	login = () => {
		this.props.login(this.state)
	};
	render() {
		const {redirectTo, msg} = this.props
		if (redirectTo) {
			return <Redirect to={redirectTo}/>
		}
		return (
			<div>
				<Logo/>
				<div>
					<p className="title">登录</p>
				</div>
				{msg ? <p className='error-msg'>{msg}</p> : null}
				<InputItem
					clear
					onChange={(v) => this.onChange('username', v)}
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
export default connect(
	state => state.user,
	{login}
)(Login)
