/* eslint-disable no-unused-vars */
// eslint-disable-next-line strict
const { Service } = require('egg')
const nodemailer = require('nodemailer')

const userEmail = '1312943214@qq.com'
const transporter = nodemailer.createTransport({
  service: 'qq',
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: 'uabi qopr xsed icfg',
  },
})

class ToolService extends Service {
  // eslint-disable-next-line no-unused-vars
  async sendMail(email, subject, text, html) {
    const mailOptions = {
      from: userEmail,
      cc: userEmail,
      to: email,
      subject,
      text,
      html,
    }
    try {
      await transporter.sendMail(mailOptions)
      return true
    } catch (err) {
      console.log('email error', err)
      return false
    }
  }
}
module.exports = ToolService
