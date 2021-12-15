// import _ from 'lodash'
import moment from 'moment'
import to from 'await-to-js'
import { logger } from '../../lib'
import { article } from '../../models'
import config from '../../config/configs.js'
import savePictrue from '../services/save-pictrue'

const logHead = `[About us]`
export default {
  async add (req, res) {
    console.log(`About us add`)
    const { localIp } = config.getConfigs()
    let { body } = req
    let { bannerUrl, imagesUrl, description } = body
    // Check url
    let checkStr = 'http'
    if (bannerUrl.indexOf(checkStr) === -1) {
      // base64轉成圖片並存起來
      let url = await savePictrue(bannerUrl, `aboutusBanner-${moment().valueOf()}`)
      if (!url) return res.json({ status: 500, message: `[About us] 圖檔錯誤，請重新上傳。` })
      bannerUrl = `${localIp}${url}`
    }

    for (let i = 0, len = imagesUrl.length; i < len; i++) {
      let img = imagesUrl[i]
      if (img.indexOf(checkStr) === -1) {
        let url = await savePictrue(img, `aboutusBanner-${moment().valueOf()}`)
        if (!url) return res.json({ status: 500, message: `[About us] 圖檔錯誤，請重新上傳。` })
        imagesUrl[i] = `${localIp}${url}`
      }
    }

    let createData = {
      description,
      type: 'aboutus',
      enabled: true,
      images: imagesUrl,
      banner: bannerUrl
    }

    console.log(`Add about us: ${JSON.stringify(createData)}`)

    let [err] = await to(article.create(createData))
    if (err) {
      logger.error(`${logHead} Create about us data err.`, err)
      return res.json({ status: 500, message: err })
    }

    return res.json({
      status: 200,
      message: `success`
    })
  },
  async find (req, res) {
    let resData = {}
    let query = { type: 'aboutus' }
    let [err, data] = await to(article.findOne(query))
    if (err) {
      logger.error(`${logHead} Find about us data err.`, err)
      return res.json({ status: 500, message: err })
    }

    if (data) {
      let { title, images, banner, description } = data
      resData = {
        title,
        imagesUrl: images,
        bannerUrl: banner,
        description
      }
    }

    return res.json({
      status: 200,
      message: `success`,
      data: { aboutus: resData }
    })
  },
  async update (req, res) {
    let { body } = req
    let { imagesUrl, bannerUrl, description } = body

    let updateData = {
      images: imagesUrl,
      banner: bannerUrl,
      description
    }
    let keys = Object.keys(updateData)
    for (let k of keys) {
      if (updateData[k] === null || updateData[k] === undefined) {
        delete updateData[k]
      }
    }

    let query = { type: 'aboutus' }
    let [err, aboutus] = await to(article.findOneAndUpdate(query, updateData))
    if (err) {
      logger.error(`${logHead} Update about us data err.`, err)
      return res.json({ status: 500, message: err })
    }

    let resData = {}
    if (aboutus) {
      let { title, images, banner, description } = aboutus
      resData = {
        title,
        imagesUrl: images,
        bannerUrl: banner,
        description
      }

      console.log(`Find about us: ${JSON.stringify(resData)}`)
    }

    return res.json({
      status: 200,
      message: `success`,
      data: { aboutus: resData }
    })
  },
  async delete (req, res) {
    let query = { type: 'aboutus' }
    let [err] = await to(article.deleteOne(query))
    if (err) {
      logger.error(`${logHead} Delete about us data err.`, err)
      return res.json({ status: 500, message: err })
    }

    return res.json({
      status: 200,
      message: `success`
    })
  }
}
