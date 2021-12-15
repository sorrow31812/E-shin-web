// import _ from 'lodash'
import moment from 'moment'
import to from 'await-to-js'
import { logger } from '../../lib'
import { article } from '../../models'
import config from '../../config/configs.js'
import savePictrue from '../services/save-pictrue'

const logHead = `[Home page]]`
export default {
  async add (req, res) {
    const { localIp } = config.getConfigs()
    let { body } = req
    let { links, videoLink, imagesUrl, description } = body
    // Check url
    let checkStr = 'http'
    for (let i = 0, len = imagesUrl.length; i < len; i++) {
      let img = imagesUrl[i]
      if (img.indexOf(checkStr) === -1) {
        let url = await savePictrue(img, `homepage-${moment().valueOf()}`)
        if (!url) return res.json({ status: 500, message: `${logHead} 圖檔錯誤，請重新上傳。` })
        imagesUrl[i] = `${localIp}${url}`
      }
    }

    let createData = {
      links,
      videoLink,
      description,
      type: 'homepage',
      enabled: true,
      images: imagesUrl
    }

    let [err] = await to(article.create(createData))
    if (err) {
      logger.error(`${logHead} Create home page data err.`, err)
      return res.json({ status: 500, message: err })
    }

    return res.json({
      status: 200,
      message: `success`
    })
  },
  async find (req, res) {
    let resData = {}
    let query = { type: 'homepage' }
    let [err, data] = await to(article.findOne(query))
    if (err) {
      logger.error(`${logHead} Find home page data err.`, err)
      return res.json({ status: 500, message: err })
    }

    if (data) {
      let { links, images, videoLink, description } = data
      resData = {
        links,
        videoLink,
        imagesUrl: images,
        description
      }
    }

    return res.json({
      status: 200,
      message: `success`,
      data: { homepage: resData }
    })
  },
  async update (req, res) {
    const { localIp } = config.getConfigs()
    let { body } = req
    let { links, videoLink, imagesUrl, description } = body

    if (imagesUrl) {
      // Check url
      let checkStr = 'http'
      for (let i = 0, len = imagesUrl.length; i < len; i++) {
        let img = imagesUrl[i]
        if (img.indexOf(checkStr) === -1) {
          let url = await savePictrue(img, `homepage-${moment().valueOf()}`)
          if (!url) return res.json({ status: 500, message: `${logHead} 圖檔錯誤，請重新上傳。` })
          imagesUrl[i] = `${localIp}${url}`
        }
      }
    }

    let updateData = {
      links,
      videoLink,
      description,
      images: imagesUrl
    }
    let keys = Object.keys(updateData)
    for (let k of keys) {
      if (updateData[k] === null || updateData[k] === undefined) {
        delete updateData[k]
      }
    }

    let query = { type: 'homepage' }
    let [err, homepage] = await to(article.findOneAndUpdate(query, updateData))
    if (err) {
      logger.error(`${logHead} Update homepage data err.`, err)
      return res.json({ status: 500, message: err })
    }

    let resData = {}
    if (homepage) {
      let { links, imagesUrl, videoLink, description } = homepage
      resData = {
        links,
        videoLink,
        imagesUrl,
        description
      }
    }

    return res.json({
      status: 200,
      message: `success`,
      data: { homepage: resData }
    })
  },
  async delete (req, res) {
    let query = { type: 'homepage' }
    let [err] = await to(article.deleteOne(query))
    if (err) {
      logger.error(`${logHead} Delete homepage data err.`, err)
      return res.json({ status: 500, message: err })
    }

    return res.json({
      status: 200,
      message: `success`
    })
  }
}
