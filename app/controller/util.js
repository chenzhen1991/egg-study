/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
'use strict'
const svgCaptcha = require('svg-captcha')
const Controller = require('egg').Controller
const BaseController = require('./base')

class UtilController extends BaseController {
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 3,
    })
    this.ctx.session.captcha = captcha.text
    this.ctx.response.type = 'image/svg+xml'
    this.ctx.body = captcha.data
  }
  async sendcode() {
    const { ctx } = this
    const email = ctx.query.email
    const code = Math.random().toString().slice(2, 6)
    console.log('邮箱' + email + '验证码' + code)
    ctx.session.emailcode = code

    const subject = 'zzz验证码'
    const text = ''
    const html = `<h2>zzz社区${code}</h2>`
    const hasSennd = await this.service.tools.sendMail(email, subject, text, html)
    if (hasSennd) {
      this.mecssage('发送成功')
    } else {
      this.error('发送失败')
    }
  }
}

module.exports = UtilController
