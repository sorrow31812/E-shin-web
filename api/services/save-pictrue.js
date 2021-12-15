import fs from 'fs'
import config from '../../config/configs.js'

const savePictrue = (img, fileName) => {
  const { imgFolder } = config.getConfigs()
  // 先把截圖base64轉圖片再存到imgFolder(/home/admin/picture)
  let base64Data = img.replace(/^data:image\/\w+;base64,/, '')
  let reg = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
  let checkBase64 = reg.test(img)
  if (!checkBase64) return null
  let dataBuffer = Buffer.from(base64Data, 'base64')

  let ext = '.png'
  let targetPath = `${imgFolder}/${fileName}${ext}`
  fs.writeFile(targetPath, dataBuffer, err => {
    if (err) console.log(err)
  })

  return targetPath
}

export default savePictrue
