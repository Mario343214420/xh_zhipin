# react pro
## 文件结构

* src // 客户端代码文件
    * api // 请求模块文件
    * assets // 共用资源文件
    * components // UI组件模块文件
    * containers // 容器组件模块文件
    * redux // redux相关模块文件
    * utils // 工具模块文件
    * index.js // 入口js
## 主要问题

问题内容参照搭建过程发现顺序
1. 按需打包
参照antd-mobile文档
config-overrided.js变动
```
npm install babel-plugin-import --save-dev
```
```
+ const { override, fixBabelImports } = require('customize-cra');
- module.exports = function override(config, env) {
-   // do stuff with the webpack config...
-   return config;
- };
+ module.exports = override(
+   fixBabelImports('import', {
+     libraryName: 'antd-mobile',
+     style: 'css',
+   }),
+ );
```

* 引入形式
```
- import Button from 'antd-mobile/lib/button';
+ import { Button } from 'antd-mobile';
```

## 项目实例内容

### api模块配置
#### 1)api/ajax.js
```
/*
使用axios封装的ajax请求函数
函数返回的是promise对象
 */

import axios from 'axios'

export default function ajax(url = '', data = {}, type = 'GET') {
  if (type === 'GET') {
    // 准备url query参数数据
    let dataStr = '' //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&'
    })
    if (dataStr !== '') {
      dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
      url = url + '?' + dataStr
    }
    // 发送get请求
    return axios.get(url)
  } else {
    // 发送post请求
    return axios.post(url, data)  // data: 包含请求体数据的对象
  }
}
```
#### 2)api/index.js
```
/*
包含n个接口请求函数的模块
每个函数返回的都是promise对象
 */
import ajax from './ajax'

// 请求注册
export const reqRegister = (user) => ajax('/register', user, 'POST')
// 请求登陆
export const reqLogin = (user) => ajax('/login', user, 'POST')
```
#### 3)配置ajax请求的代理: package.json
```
"proxy": "http://localhost:5000"
```
### redux管理用户信息
#### 1)redux/action-types.js
```
// 包含所有action的type常量名称的模块

// 验证成功
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
// 请求出错
export const ERROR_MSG = 'ERROR_MSG'
```
#### 2)redux/actions.js
```
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
const errorMsg = (msg) => ({type:ERROR_MSG, data: msg})
// 同步成功响应
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})

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
    const response = await reqRegister({username, password, type})
    // 得到响应体数据
    const result = response.data
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
    const response = await reqLogin({username, password})
    const result = response.data
    if (result.code === 0) {
      dispatch(authSuccess(result.data))
    } else {
      dispatch(errorMsg(result.msg))
    }
  }
}
```
#### 3)redux/reducers.js
```
// 包含n个根据老的state和action返回新的state的函数的模块
import {combineReducers} from 'redux'

import {
  AUTH_SUCCESS,
  ERROR_MSG
} from './action-types'

const initUser = {
  username: '', // 用户名
  type: '', // 类型
  msg: '', // 错误提示信息
  redirectTo: '' // 需要自动跳转的路由path
}
function user(state = initUser, action) {
  switch (action.type) {
    case AUTH_SUCCESS: // 认证成功
      return {...action.data, redirectTo: '/'}
    case ERROR_MSG: // 错误信息提示
      return {...state, msg: action.data}
    default:
      return state
  }
}

// 返回合并的reducer
export default combineReducers({
  user
})
```
### 注册组件: register.jsx
```
/*
用户注册的路由组件
 */
import React, {Component} from 'react'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {register} from '../../redux/actions'

class Register extends Component {

  state = {
    username: '',
    password: '',
    password2: '',
    type: 'dashen'
  }

  // 处理输入框/单选框变化, 收集数据到state
  handleChange = (name, value) => {
    this.setState({[name]: value})
  }

  // 跳转到login路由
  toLogin = () => {
    this.props.history.replace('/login')
  }

  // 注册
  register = () => {
    this.props.register(this.state)
  }

  render() {
    const {type} = this.state
    const {redirectTo, msg} = this.props
    if (redirectTo) {
      return <Redirect to={redirectTo}/>
    }

    return (
      <div>
        <NavBar>硅谷直聘</NavBar>
        <Logo/>
        <WingBlank>
          {msg ? <p className='error-msg'>{msg}</p> : null}
          <List>
            <InputItem
              placeholder='输入用户名'
              onChange={val => this.handleChange('username', val)}
            >
              用户名:
            </InputItem>
            <WhiteSpace/>
            <InputItem
              type='password'
              placeholder='输入密码'
              onChange={val => this.handleChange('password', val)}
            >
              密&nbsp;&nbsp;&nbsp;码:
            </InputItem>
            <WhiteSpace/>
            <InputItem
              type='password'
              placeholder='输入确认密码'
              onChange={val => this.handleChange('password2', val)}
            >
              确认密码:
            </InputItem>
            <WhiteSpace/>
            <List.Item>
              <span style={{marginRight: 30}}>用户类型:</span>
              <Radio checked={this.state.type==='dashen'}
                     onClick={() => {this.handleChange('type', 'dashen')}}>大神</Radio>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Radio checked={this.state.type==='laoban'}
                     onClick={() => {this.handleChange('type', 'laoban')}}>老板</Radio>
            </List.Item>
            <WhiteSpace/>
            <Button type='primary' onClick={this.register}>注&nbsp;&nbsp;&nbsp;册</Button>
            <WhiteSpace/>
            <Button onClick={this.toLogin}>已经有账号</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => state.user,
  {register}
)(Register)
```
### 登陆组件: login.jsx
```
// 用户登陆的路由组件

import React, {Component} from 'react'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {login} from '../../redux/actions'

class Login extends Component {
  state = {
    username: '',
    password: '',
  }

  // 处理输入框/单选框变化, 收集数据到state
  handleChange = (name, value) => {
    this.setState({[name]: value})
  }

  // 跳转到注册路由
  toRegister = () => {
    this.props.history.replace('/register')
  }

  // 注册
  login = () => {
    this.props.login(this.state)
  }

  render() {
    const {redirectTo, msg} = this.props
    if (redirectTo) {
      return <Redirect to={redirectTo}/>
    }

    return (
      <div>
        <NavBar>硅谷直聘</NavBar>
        <Logo/>
        <WingBlank>
          {msg ? <p className='error-msg'>{msg}</p> : null}
          <List>
            <InputItem
              placeholder='输入用户名'
              onChange={val => this.handleChange('username', val)}
            >
              用户名:
            </InputItem>
            <WhiteSpace/>
            <InputItem
              type='password'
              placeholder='输入密码'
              onChange={val => this.handleChange('password', val)}
            >
              密&nbsp;&nbsp;&nbsp;码:
            </InputItem>
            <WhiteSpace/>
            <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;&nbsp;陆</Button>
            <WhiteSpace/>
            <Button onClick={this.toRegister}>还没有账号</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => state.user,
  {login}
)(Login)
```
### 样式: assets/css/index.less
```css
.error-msg {
  color: red;
  text-align: center;
  font-size: 18px;
}

/*需要在index.js中引入*/
```
## 功能性内容完善
### 引入js-coo
```
npm install --save js-cookie / yarn add js-cookie
```
### 注册/登陆成功的路由跳转
#### 1)工具模块: utils/index.js
```
/*
包含n个工具函数的模块
 */
/*
注册laoban--> /laobaninfo
注册大神--> /dasheninfo
登陆laoban --> /laobaninfo 或者 /laoban
登陆大神 --> /dasheninfo 或者 /dashen
 */
export function getRedirectPath(type, header) {
  let path = ''

  // 根据type得到path
  path += type==='laoban' ? '/laoban' : '/dashen'
  // 如果没有头像添加info
  if(!header) {
    path += 'info'
  }

  return path
}
```
#### 2)reducers中使用工具: redux/reducers.js
```javascript
import {getRedirectPath} from '../utils';

case AUTH_SUCCESS: // 认证成功
  const redirectTo = getRedirectPath(action.data.type, action.data.header)
  return {...action.data, redirectTo}
```
### 后台路由: routes/index.js
```
// 更新用户信息的路由
router.post('/update', (req, res) => {
  // 从请求的cookie得到userid
  const userid = req.cookies.userid
  // 如果不存在, 直接返回一个提示信息
  if (!userid) {
    return res.send({code: 1, msg: '请先登陆'})
  }
  // 存在, 根据userid更新对应的user文档数据
  // 得到提交的用户数据
  const user = req.body // 没有_id
  UserModel.findByIdAndUpdate({_id: userid}, user)
    .then(oldUser => {
      if (!oldUser) {
        // 通知浏览器删除userid cookie
        res.clearCookie('userid')
        // 返回返回一个提示信息
        res.send({code: 1, msg: '请先登陆'})
      } else {
        // 准备一个返回的user数据对象
        const {_id, username, type} = oldUser
        const data = Object.assign({_id, username, type}, user)
        // 返回
        res.send({code: 0, data})
      }
    })
    .catch(error => {
      console.error('登陆异常', error)
      res.send({code: 1, msg: '更新异常, 请重新尝试'})
    })
})
```
### 更新的ajax请求: api/index.js
```
// 更新用户信息
export const reqUpdateUser = (user) => ajax('/update', user, 'POST')
```
### 2.12.5. redux更新状态: 
#### 1)redux/action-types.js
```
// 接收用户
export const RECEIVE_USER = 'RECEIVE_USER'
// 重置用户
export const RESET_USER = 'RESET_USER'
```
#### 2)redux/actions.js
```
import {
  RECEIVE_USER,
RESET_USER
} from './action-types'
import {
  reqUpdateUser
} from '../api'

// 同步接收用户
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})
// 同步重置用户
export const resetUser = (msg) => ({type: RESET_USER, data: msg})

/*
异步更新用户
 */
export const updateUser = (user) => {
  return async dispatch => {
    // 发送异步ajax请求
    const response = await reqUpdateUser(user)
    const result = response.data
    if (result.code === 0) { // 更新成功
      dispatch(receiveUser(result.data))
    } else { // 失败
      dispatch(resetUser(result.msg))
    }
  }
}
```
#### 3)redux/reducers.js
```javascript
import {
  RECEIVE_USER,
  RESET_USER
} from './action-types'

function user(state = initUser, action) {
  switch (action.type) {
    case RECEIVE_USER: // 接收用户
      return action.data
    case RESET_USER: // 重置用户
      return {...initUser, msg: action.data}
  }
}
```
