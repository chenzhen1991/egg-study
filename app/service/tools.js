/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line strict
const { Service } = require('egg')
const nodemailer = require('nodemailer')
const path = require('path')
const fse = require('fs-extra')

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
  async mergeFile(filePath, filehash, size) {
    const chunkdDir = path.resolve(this.config.UPLOAD_DIR, filehash) // 切片额文件夹
    let chunks = await fse.readdir(chunkdDir)
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1])
    chunks = chunks.map(cp => path.resolve(chunkdDir, cp))
    await this.mergeChunks(chunks, filePath, size)
  }
  async mergeChunks(files, dest, size) {
    const pipStream = (filePath, writeStream) => new Promise(resolve => {
      const readStream = fse.createReadStream(filePath)
      readStream.on('end', () => {
        fse.unlinkSync(filePath)
        resolve()
      })
      readStream.pipe(writeStream)
    })

    await Promise.all(
      files.map((file, index) => {
        pipStream(file, fse.createReadStream(dest, {
          start: index * size,
          end: (index + 1) * size,
        }))
      })
    )
  }
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
