/* eslint-disable no-empty */
/* eslint-disable no-empty-function */
'use strict'
const BaseController = require('./base')

const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' },
  password: { type: 'string' },
  captcha: { type: 'string' },
}

class UserController extends BaseController {
  async login() {

  }
  async register() {
    const { ctx } = this
    try {
      // 校验传递的参数
      ctx.validate(createRule)
    } catch (e) {
      return this.erro('参数校验失败', -1, e.errors)
    }
    const { email, password, captcha, nickname } = ctx.request.body
    console.log({ email, password, captcha, nickname })
    if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {
      // 邮箱是不是重复
    } else {
      this.error('验证码错误')
    }
  }
  async verify() {

  }
  async info() {

  }
}
module.exports = UserController
