import to from 'await-to-js'
import { logger } from '../../lib'
import { user, password } from '../../models'

const logHead = `[User] `
export default {
  /**
   * 使用者管理
   * @param {*} req
   * @param {*} res
   */
  async add (req, res) {
    const { body } = req
    const { name, password: p, mail, auth } = body

    let createData = {
      name,
      mail,
      permission: auth,
      locale: 'zh-tw',
      enabled: true
    }
    let [userErr, userData] = await to(user.create(createData))
    if (userErr || !userData) {
      logger.error(`${logHead}create err`, userErr)
      return res.json({ status: 400, message: '建立帳號失敗' })
    }

    let { _id, id, enabled, createdAt, permission } = userData
    let [pwErr, pw] = await to(password.create({ user: _id, userId: id, password: p }))
    if (pwErr || !pw) {
      logger.error(`${logHead}create err`, pwErr)
      return res.json({ status: 400, message: '建立密碼失敗' })
    }

    let uData = {
      id,
      name,
      mail,
      enabled,
      password: pw,
      createdTime: createdAt,
      auth: permission
    }

    let result = {
      status: 200,
      message: 'ok',
      data: { user: uData }
    }

    return res.json(result)
  },
  async find (req, res) {
    console.info(`Find all user`)
    let [uErr, userData] = await to(user.find().sort({ createdAt: 1 }))
    if (uErr) {
      logger.error(`${logHead}Find user data fail.`, uErr)
      return res.json({ status: 500, message: '抓取使用者資料失敗' })
    }

    let resData = []
    if (userData) {
      for (let i = 0, len = userData.length; i < len; i++) {
        let d = userData[i]
        let { id, name, mail, enabled, permission, createdAt } = d
        let [pErr, pwData] = await to(password.findOne({ userId: id }))
        if (pErr || !pwData) {
          logger.error(`${logHead}Find user ${id} password fail.`, pErr)
          return res.json({ status: 500, message: '抓取使用者資料失敗' })
        }

        let { password: pw } = pwData
        let uData = {
          id,
          name,
          mail,
          enabled,
          password: pw,
          createdTime: createdAt,
          auth: permission
        }
        resData.push(uData)
      }
    }

    let result = {
      status: 200,
      message: 'ok',
      data: { user: resData }
    }

    return res.json(result)
  },
  async update (req, res) {
    let { body } = req
    let { id, name, mail, enabled, password: pw, auth } = body

    let updateData = { name, mail, permission: auth, enabled }
    let keys = Object.keys(updateData)
    for (let k of keys) {
      if (updateData[k] === null || updateData[k] === undefined) {
        delete updateData[k]
      }
    }

    let query = { id }
    let [err, userData] = await to(user.findOneAndUpdate(query, updateData))
    if (err) {
      logger.error(`${logHead} Update user data err.`, err)
      return { status: 500, message: err }
    }

    let pwQuery = { userId: id }
    let [pwErr] = await to(user.findOneAndUpdate(pwQuery, { password: pw }))
    if (pwErr) {
      logger.error(`${logHead} Update user password err.`, pwErr)
      return { status: 500, message: err }
    }

    let { createdAt } = userData
    let uData = {
      id,
      name,
      mail,
      auth,
      enabled,
      password: pw,
      createdTime: createdAt
    }

    let result = {
      status: 200,
      message: 'ok',
      data: { user: uData }
    }

    return res.json(result)
  },
  async delete (req, res) {
    const { params } = req
    const { id } = params
    let query = { id }
    let [err] = await to(user.deleteOne(query))
    if (err) {
      logger.error(`${logHead} Delete about us data err.`, err)
      return { status: 500, message: err }
    }

    return res.json({
      status: 200,
      message: `success`
    })
  },
  async findOne (req, res) {
    const { params } = req
    const { id } = params
    console.info(`Find user: ${id}`)
    let [findErr, userData] = await to(user.findOne({ id }))
    if (findErr || !userData) {
      logger.error(`${logHead}Find user err`, findErr)
      return res.json({ status: 400, message: '找不到該使用者' })
    }

    let [findPwErr, pwData] = await to(password.findOne({ userId: id }))
    if (findPwErr || !pwData) {
      logger.error(`${logHead}Find password err`, findErr)
      return res.json({ status: 400, message: '找不到該使用者' })
    }

    let { password: pw } = pwData
    let { name, mail, permission, createdAt } = userData
    let uData = {
      id,
      name,
      mail,
      password: pw,
      createdTime: createdAt,
      auth: permission
    }

    let result = {
      status: 200,
      message: 'ok',
      data: { user: uData }
    }

    return res.json(result)
  }
}
