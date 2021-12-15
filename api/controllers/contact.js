import to from 'await-to-js'
import { logger } from 'lib'
import { contact } from '../../models'
// import sendLineNotify from '../services/send-line-notify'

const logHead = `[Contact]`
export default {
  async add (req, res) {
    let { body } = req
    let { name, phone, mail, desc } = body

    let createData = {
      name, phone, mail, desc
    }

    let [err] = await to(contact.create(createData))
    if (err) {
      logger.error(`${logHead} Create about us data err.`, err)
      return res.json({ status: 500, message: err })
    }

    // Send notify
    // let message = `[Contact-test] contact id: ${data.id}`
    // let [errSendNotify] = await to(sendLineNotify({ message }))
    // if (errSendNotify) {
    //   logger.error(`Send line nodify error.`, errSendNotify)
    //   return { status: 500, message: errSendNotify }
    // }

    res.json({
      status: 200,
      message: `success`
    })
  },
  async find (req, res) {
    let query = {}
    let [err, data] = await to(contact.find(query).sort({ createdAt: -1 }))
    if (err) {
      logger.error(`${logHead} Find contact data err.`, err)
      return res.json({ status: 500, message: err })
    }

    let resData = []
    for (let i = 0, len = data.length; i < len; i++) {
      let d = data[i]
      if (d) {
        let { id, name, phone, mail, desc, createdAt } = d
        resData.push({ id, name, phone, mail, desc, createdAt })
      }
    }

    res.json({
      status: 200,
      message: `success`,
      data: { contact: resData }
    })
  },
  async update (req, res) {
    let { body } = req
    let { id, name, phone, mail, desc } = body

    let updateData = { name, phone, mail, desc }
    let keys = Object.keys(updateData)
    for (let k of keys) {
      if (updateData[k] === null || updateData[k] === undefined) {
        delete updateData[k]
      }
    }

    let query = { id }
    let [err] = await to(contact.findOneAndUpdate(query, updateData))
    if (err) {
      logger.error(`${logHead} Update contact data err.`, err)
      return res.json({ status: 500, message: err })
    }

    return res.json({
      status: 200,
      message: `success`,
      data: { contact: updateData }
    })
  },
  async delete (req, res) {
    const { params } = req
    const { id } = params
    let query = { id }
    let [err] = await to(contact.deleteOne(query))
    if (err) {
      logger.error(`${logHead} Delete contact data err.`, err)
      return res.json({ status: 500, message: err })
    }

    return res.json({
      status: 200,
      message: `success`
    })
  }
}
