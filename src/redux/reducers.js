// 包含n个根据老的state和action返回新的state的函数的模块
import {combineReducers} from 'redux'
import {getRedirectPath} from "../utils"
import {
	AUTH_SUCCESS,
	ERROR_MSG,
	RECEIVE_USER,
	RESET_USER
} from './action-types'

const initUser = {
	username: '', // 用户名
	type: '', // 性别
	msg: '', // 错误提示信息
	redirectTo: '' // 需要自动跳转的路由path
}

function user(state = initUser, action) {
	switch (action.type) {
		case AUTH_SUCCESS: // 认证成功
			const redirectTo = getRedirectPath(action.data.type, action.data.header)
			return {...action.data, redirectTo}
		case ERROR_MSG: // 错误信息提示
			return {...state, msg: action.data}
		case RECEIVE_USER:
			return action.data
		case RESET_USER:
			return {...initUser, msg: action.data}
		default:
			return state
	}
}

// 返回合并的reducer
export default combineReducers({
	user
})
