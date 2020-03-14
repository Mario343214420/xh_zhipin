/*
用户注册的路由组件
 */
import React, { Component } from 'react'
import { InputItem, Radio, Button } from 'antd-mobile'
import Logo from '../../components/logo/logo'

import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { register } from '../../redux/actions'

class Register extends Component {
	state = {
		username: '',
		password: '',
		password2: '',
		type: ''
	};
	toLogin = () => {
		this.props.history.replace('/login')
	};
	onChange = (name, v) => {
		this.setState({ [name]: v });
	};
	onChange4 = (v) => {
		this.setState({
			type: v,
		});
	};
	register = () => {
		this.props.register(this.state)
	};
	render() {
		const gender = [
			{ value: 0, label: 'w' },
			{ value: 1, label: 'm' }
		];
		const {redirectTo, msg} = this.props;
		if(redirectTo) {
			return <Redirect to={redirectTo}/>
		}
		return (
			<div>
				<Logo/>
				<div>
					<p className="title">注册</p>
				</div>
				<InputItem
					clear
					onChange = {(v) => this.onChange('username', v)}
					placeholder="请输入您的账号"
				>账号</InputItem>
				<InputItem
					clear
					onChange = {(v) => this.onChange('password', v)}
					placeholder="请输入您的密码"
				>密码</InputItem>
				<InputItem
					clear
					onChange = {(v) => this.onChange('password2', v)}
					placeholder = "请重新输入验证您的密码"
				>密码验证</InputItem>
				{/*RadioBox*/}
				<div className="radio-box">
					{gender.map(
						i => (
							<Radio className="my-radio" key={i.value} checked={this.state.type === i.value} onChange={() => this.onChange4(i.value)}>
								<span className="my-radio-text">{i.label==='w'?'女':'男'}</span>
							</Radio>
						)
					)}
				</div>
				<div>
					<Button onClick={ this.register }>提交</Button>
				</div>
				<div>
					<Button onClick={ this.toLogin }>登录</Button>
				</div>
			</div>
		)
	}
}
export default connect(
	state => state.user,
	{register}
)(Register)
