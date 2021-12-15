import _ from 'lodash'
import to from 'await-to-js'
import moment from 'moment'
import { logger } from '../../lib'
import { article } from '../../models'
import config from '../../config/configs.js'
import savePictrue from '../services/save-pictrue'

const logHead = `[Notice]`
export default {
  async find (req, res) {
    let resData = []
    // 尋找尚未過期的活動
    let startTime = moment().valueOf()
    let query = { type: 'notice', startTime: { $gt: startTime } }
    let [err, data] = await to(article.find(query).sort({ createdAt: -1 }))
    if (err) {
      logger.error(`${logHead} Find notice data err.`, err)
      return { status: 500, message: err }
    }

    if (data) {
      for (let i = 0, len = data.length; i < len; i++) {
        let d = data[i]
        let { id, title, images, banner, enabled, startTime: st, description } = d
        let nData = {
          id,
          enabled,
          startTime: st,
          className: title,
          imagesUrl: images,
          bannerUrl: banner,
          description
        }
        resData.push(nData)
      }

      console.log(`Find notice data: ${resData}`)
    }

    return res.json({
      status: 200,
      message: `success`,
      data: { notice: resData }
    })
  },
  async expired (req, res) {
    let resData = []
    // 尋找過期的活動
    let startTime = moment().valueOf()
    let query = { type: 'notice', startTime: { $lt: startTime } }
    let [err, data] = await to(article.find(query))
    if (err) {
      logger.error(`${logHead} Find notice data err.`, err)
      return { status: 500, message: err }
    }

    if (data) {
      for (let i = 0, len = data.length; i < len; i++) {
        let d = data[i]
        let { id, title, images, banner, enabled, startTime: st, description } = d
        let nData = {
          id,
          enabled,
          startTime: st,
          className: title,
          imagesUrl: images,
          bannerUrl: banner,
          description
        }
        resData.push(nData)
      }
    }

    return res.json({
      status: 200,
      message: `success`,
      data: { notice: resData }
    })
  },
  async add (req, res) {
    const { localIp } = config.getConfigs()
    let { body } = req
    let { enabled, startTime, className, bannerUrl, imagesUrl, description } = body

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
        let url = await savePictrue(img, `noticeImages-${moment().valueOf()}`)
        if (!url) return res.json({ status: 500, message: `[Notice] 圖檔錯誤，請重新上傳。` })
        imagesUrl[i] = `${localIp}${url}`
      }
    }

    let createData = {
      enabled,
      startTime,
      description,
      type: 'notice',
      images: imagesUrl,
      banner: bannerUrl,
      title: className
    }

    console.log(`Add notice: ${JSON.stringify(createData)}`)

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
  async update (req, res) {
    const { localIp } = config.getConfigs()
    let { body } = req
    let { id, enabled, startTime, className, bannerUrl, imagesUrl, description } = body

    // Check url
    let checkStr = 'http'
    if (bannerUrl) {
      if (bannerUrl.indexOf(checkStr) === -1) {
        // base64轉成圖片並存起來
        let url = await savePictrue(bannerUrl, `aboutusBanner-${moment().valueOf()}`)
        if (!url) return res.json({ status: 500, message: `[About us] 圖檔錯誤，請重新上傳。` })
        bannerUrl = `${localIp}${url}`
      }
    }

    if (_.size(imagesUrl)) {
      for (let i = 0, len = imagesUrl.length; i < len; i++) {
        let img = imagesUrl[i]
        if (img.indexOf(checkStr) === -1) {
          let url = await savePictrue(img, `noticeImages-${moment().valueOf()}`)
          if (!url) return res.json({ status: 500, message: `[Notice] 圖檔錯誤，請重新上傳。` })
          imagesUrl[i] = `${localIp}${url}`
        }
      }
    }

    let updateData = { enabled, startTime, images: imagesUrl, banner: bannerUrl, description, title: className }
    let keys = Object.keys(updateData)
    for (let k of keys) {
      if (updateData[k] === null || updateData[k] === undefined) {
        delete updateData[k]
      }
    }

    let query = { id, type: 'notice' }
    let [err, data] = await to(article.findOneAndUpdate(query, updateData))
    if (err) {
      logger.error(`${logHead} Update notice data err.`, err)
      return { status: 500, message: err }
    }

    let resData = {}
    if (data) {
      let { title, images, banner, enabled, startTime: st, description } = data
      resData = {
        enabled,
        startTime: st,
        className: title,
        imagesUrl: images,
        bannerUrl: banner,
        description
      }
    }

    return res.json({
      status: 200,
      message: `success`,
      data: { notice: resData }
    })
  },
  async delete (req, res) {
    const { params } = req
    const { id } = params
    let query = { id, type: 'notice' }
    let [err] = await to(article.deleteOne(query))
    if (err) {
      logger.error(`${logHead} Delete about us data err.`, err)
      return { status: 500, message: err }
    }

    return res.json({
      status: 200,
      message: `success`
    })
  }
}
