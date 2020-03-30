// 包含所有action creator函数的模块
import {
	AUTH_SUCCESS,
	ERROR_MSG
} from './action-types'
import {
	reqRegister,
	reqLogin
} from '../api'

// 同步错误消息
const errorMsg = (msg) => ({type:ERROR_MSG, data: msg});
// 同步成功响应
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user});

// 异步注册
export function register({username, password, password2, type}) {
	// 进行前台表单验证, 如果不合法返回一个同步action对象, 显示提示信息
	if (!username || !password || !type) {
		return errorMsg('用户名密码必须输入')
	}
	if (password !== password2) {
		return errorMsg('密码和确认密码不同')
	}
	return async dispatch => {
		// 异步ajax请求, 得到响应
		console.log({username, password, type});
		const response = await reqRegister({username, password, type});
		// 得到响应体数据
		const result = response.data;
		// 如果是正确的
		if (result.code === 0) {
			// 分发成功的action
			dispatch(authSuccess(result.data))
		} else {
			// 分发提示错误的action
			dispatch(errorMsg(result.msg))
		}
	}
}

// 异步登陆
export const login = ({username, password}) => {
	if (!username || !password) {
		return errorMsg('用户密码必须输入')
	}
	return async dispatch => {
		const response = await reqLogin({username, password});
		console.log(response);
		const result = response.data;
		if (result.code === 0) {
			dispatch(authSuccess(result.data))
		} else {
			dispatch(errorMsg(result.msg))
		}
	}
};
