/*
用户注册的路由组件
 */
import React, { Component } from 'react'
import { InputItem, Radio, Button } from 'antd-mobile'
export default class Register extends Component {
	state = {
		userName: '',
		password: '',
		rePassword: '',
		value4: ''
	};
	onChange = (name, v) => {
		this.setState({[name]: v});
	};
	onChange4 = (v) => {
		this.setState({
			value4: v,
		});
	};
	register = () => {
		console.log(this.state)
	};
	render() {
		const gender = [
			{ value: 0, label: 'w' },
			{ value: 1, label: 'm' }
		];
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
				<InputItem
					clear
					onChange={(v) => this.onChange('rePassword', v)}
					placeholder="请重新输入验证您的密码"
				>密码验证</InputItem>
				{/*RadioBox*/}
				<div>
					{gender.map(
						i => (
							<Radio className="my-radio" key={i.value} checked={this.state.value4 === i.value} onChange={() => this.onChange4(i.value)}>
								{i.label==='w'?'女':'男'}
							</Radio>
						)
					)}
				</div>
				<div>
					<Button onClick={ this.register }>提交</Button>
				</div>
			</div>
		)
	}
}
