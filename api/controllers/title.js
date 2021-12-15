import _ from 'lodash'
import to from 'await-to-js'
import { logger } from '../../lib'
import { article } from '../../models'

const logHead = `[Title]`
export default {
  async find (req, res) {
    let resData = []
    let query = { type: 'title', enabled: true }
    let [err, data] = await to(article.findOne(query))
    if (err) {
      logger.error(`${logHead} Find about us data err.`, err)
      return { status: 500, message: err }
    }

    if (data) resData = _.pick(data, ['description'])

    return res.json({
      status: 200,
      message: `success`,
      data: { title: resData }
    })
  },
  async add (req, res) {
    let { body } = req
    let { description } = body
    let createData = {
      enabled: true,
      type: 'title',
      description
    }

    let [err] = await to(article.create(createData))
    if (err) {
      logger.error(`${logHead} Create title data err.`, err)
      return { status: 500, message: err }
    }

    return res.json({
      status: 200,
      message: `success`
    })
  },
  async delete (req, res) {
    let query = { type: 'title' }
    let [err] = await to(article.deleteOne(query))
    if (err) {
      logger.error(`${logHead} Delete about us data err.`, err)
      return { status: 500, message: err }
    }

    return res.json({
      status: 200,
      message: `success`
    })
  },
  async update (req, res) {
    let { body } = req
    let { description } = body

    let updateData = { description }

    let query = { type: 'title' }
    let [err] = await to(article.findOneAndUpdate(query, updateData))
    if (err) {
      logger.error(`${logHead} Update title data err.`, err)
      return { status: 500, message: err }
    }

    return res.json({
      status: 200,
      message: `success`
    })
  }
}
