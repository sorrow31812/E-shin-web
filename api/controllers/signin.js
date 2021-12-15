import oauth from './auth'
import to from 'await-to-js'
import { logger } from '../../lib'
import { user } from 'models'

const logHead = `[signin] `
export default {
  in: async function (req, res) {
    let { type } = req.params
    if (!type) type = 'email'
    await oauth[type].signin(req, res)
  },
  out: async function (req, res) {
    const { body } = req
    let { mail } = body

    // 使用者下線
    let [findErr] = await to(user.findOneAndUpdate({ mail }, { online: false }))
    if (findErr) {
      logger.error(`${logHead}Update user err`, findErr)
      return res.json({ status: 400, message: '尋找使用者發生錯誤' })
    }

    let result = {
      status: 200,
      message: 'ok',
      data: {}
    }
    return res.json(result)
  }
}
