import config from 'config'
import request from 'superagent'
import to from 'await-to-js'
import { logger } from '../../lib'
import emoji from 'node-emoji'

const sendLineNotify = async (reqBody) => {
  let { lineAuthCode, lineNotifyUrl } = config.getConfigs()
  let { message } = reqBody
  logger.info(`msg: ${message.toString()} / ${lineNotifyUrl} / ${lineAuthCode}`)
  if (!lineNotifyUrl) lineNotifyUrl = 'https://notify-api.line.me/api/notify'
  if (!lineAuthCode) lineAuthCode = null // 'YPceq8vKmkoNSP57iK3wCl1YHDhDWMraYd0WqqqdkQp'
  message = emoji.emojify(`${message}`)

  const [ err ] = await to(request
    .post(lineNotifyUrl)
    .field('message', message)
    .set('accept', '*/*')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', `Bearer ${lineAuthCode}`))

  if (err) logger.error(`${err.message}`)

  return null
}

export default sendLineNotify
