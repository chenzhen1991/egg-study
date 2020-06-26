/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable no-empty-function */
'use strict'
const md5 = require('md5')
const BaseController = require('./base')
const jwt = require('jsonwebtoken')

const HashSalt = ':ZZZ@good!@123'
const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' },
  password: { type: 'string' },
  captcha: { type: 'string' },
}

class UserController extends BaseController {
  async login() {
    // this.success('token')
    const { ctx, app } = this
    const { email, captcha, password, emailcode } = ctx.request.body
    console.log(captcha, ctx.session.captcha)
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }

    if (emailcode !== ctx.session.emailcode) {
      return this.error('邮箱验证码错误')
    }

    const user = await ctx.model.User.findOne({
      email,
      password: md5(password + HashSalt),
    })
    if (!user) {
      return this.error('用户名密码错误')
    }
    // 用户的嘻嘻加密成token  返回
    const token = jwt.sign({
      _id: user._id,
      email,
    }, app.config.jwt.secret, {
      expiresIn: '1h',
    })
    this.success({ token, email, nickname: user.nickname })
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
      if (await this.checkEmail(email)) {
        this.error('邮箱重复了')
      } else {
        const ret = await ctx.model.User.create({
          email,
          nickname,
          password: md5(password + HashSalt),
        })
        if (ret._id) {
          this.message('注册成功')
        }
      }
    } else {
      this.error('验证码错误')
    }
  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email })
    return user
  }
  async verify() {

  }
  async info() {
    const { ctx } = this
    // 你还不知道是哪个邮件  需要从token里去读取
    // 有的接口需要从token获取数据 有的不需要

    const { email } = ctx.state
    const user = await this.checkEmail(email)
    this.success(user)
  }
}
module.exports = UserController
