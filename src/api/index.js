/*
包含n个接口请求函数的模块
每个函数返回的都是promise对象
 */
import ajax from './ajax'

// 请求注册
export const reqRegister = (user) => ajax('/register', user, 'POST');
// 请求登陆
export const reqLogin = (user) => ajax('/login', user, 'POST');
// 更新用户信息请求
export const reqUpdateUser = (user) => ajax('/update', user, 'POST')
