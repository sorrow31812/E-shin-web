import to from 'await-to-js'
import moment from 'moment'
import { logger } from 'lib'
import { images } from '../../models'
import config from '../../config/configs.js'
import savePictrue from '../services/save-pictrue'

const logHead = `[Images]`
export default {
  async add (req, res) {
    const { localIp } = config.getConfigs()
    let { body } = req
    let { name, img } = body

    // base64轉成圖片並存起來
    name = `${name}-${moment().valueOf()}` || `e-shin-${moment().valueOf()}`
    let url = await savePictrue(img, name)

    let createData = {
      img, name, url: `${localIp}${url}`
    }

    let [err, imgData] = await to(images.create(createData))
    if (err) {
      logger.error(`${logHead} Create about us data err.`, err)
      return { status: 500, message: err }
    }

    let { id } = imgData
    delete createData.img
    createData.id = id

    res.json({
      status: 200,
      message: `success`,
      data: { images: createData }
    })
  },
  async find (req, res) {
    let query = {}
    let [err, data] = await to(images.find(query).sort({ createdAt: -1 }))
    if (err) {
      logger.error(`${logHead} Find images data err.`, err)
      return { status: 500, message: err }
    }

    let resData = []
    for (let i = 0, len = data.length; i < len; i++) {
      let d = data[i]
      if (d) {
        let { id, url, name } = d
        resData.push({ id, name, url })
      }
    }

    res.json({
      status: 200,
      message: `success`,
      data: { images: resData }
    })
  },
  async delete (req, res) {
    const { params } = req
    const { id } = params
    let query = { id }
    let [err] = await to(images.deleteOne(query))
    if (err) {
      logger.error(`${logHead} Delete image data err.`, err)
      return { status: 500, message: err }
    }

    return res.json({
      status: 200,
      message: `success`
    })
  }
}
