const mongoose = require('./mongoose')
const Base = require('./base')
const { Schema, model } = mongoose.promisify()
const { setAutoIncrement } = mongoose
const { Mixed } = Schema.Types

let schema = {
  // 自動 id
  id: {
    type: Number,
    index: true,
    unique: true
  },

  type: {
    type: String,
    index: true,
    required: true
  },

  // 標題
  title: {
    type: String,
    default: ''
  },

  // 其他情境圖
  images: {
    type: Mixed
  },

  // 主視覺情境圖
  banner: {
    type: Mixed
  },

  // 主影片連結(通常是YT)
  videoLink: {
    type: String
  },

  // 其他文章連結 [{ title, des, link, imageUrl}]
  links: {
    type: Mixed
  },

  // 說明或附註
  description: {
    type: String,
    default: ''
  },

  // 參與人數
  participant: {
    type: Number,
    default: 0
  },

  // 開始時間
  startTime: {
    type: Number
  },

  // 結束時間
  endTime: {
    type: Number
  },

  // 啟用/停用
  enabled: {
    type: Boolean,
    default: true,
    required: true,
    index: true
  }
}

schema = new Schema(schema)
schema.index({ id: 1, type: 1 })
setAutoIncrement(schema, {
  model: 'Article',
  field: 'id'
})

schema.index({ id: -1, type: -1 })
schema.index({ id: 1, type: 1, startTime: 1 })

schema.plugin(Base)
module.exports = model('Article', schema)
