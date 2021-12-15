import _ from 'lodash'
import to from 'await-to-js'
import { logger } from '../../lib'
import { article } from '../../models'

const logHead = `[Notify]`
export default {
  async add (req, res) {
    let { body } = req
    let { enabled, message } = body
    let createData = {
      enabled,
      type: 'notify',
      description: message
    }

    let [err] = await to(article.create(createData))
    if (err) {
      logger.error(`${logHead} Create about us data err.`, err)
      return { status: 500, message: err }
    }

    return res.json({
      status: 200,
      message: `success`
    })
  },
  async find (req, res) {
    let resData = []
    let query = { type: 'notify', enabled: true }
    let [err, data] = await to(article.find(query).sort({ createdAt: -1 }))
    if (err) {
      logger.error(`${logHead} Find about us data err.`, err)
      return { status: 500, message: err }
    }

    if (data) {
      resData = _.map(data, a => {
        let { description: message, createdAt: createTime } = a
        return { message, createTime }
      })
    }

    return res.json({
      status: 200,
      message: `success`,
      data: { notify: resData }
    })
  },
  async update (req, res) {
    let { body } = req
    let { id, enabled, message } = body
    let query = { id, type: 'notify' }
    let updateData = { enabled, description: message }
    let keys = Object.keys(updateData)
    for (let k of keys) {
      if (updateData[k] === null || updateData[k] === undefined) {
        delete updateData[k]
      }
    }

    let [err] = await to(article.findOneAndUpdate(query, updateData))
    if (err) {
      logger.error(`${logHead} Update notify data err.`, err)
      return { status: 500, message: err }
    }

    return res.json({
      status: 200,
      message: `success`
    })
  },
  async delete (req, res) {
    const { params } = req
    const { id } = params
    let query = { id, type: 'notify' }
    let [err] = await to(article.deleteOne(query))
    if (err) {
      logger.error(`${logHead} Delete notify data err.`, err)
      return { status: 500, message: err }
    }

    return res.json({
      status: 200,
      message: `success`
    })
  }
}
