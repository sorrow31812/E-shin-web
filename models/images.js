const mongoose = require('./mongoose')
const Base = require('./base')

const { Schema, model } = mongoose.promisify()
const { setAutoIncrement } = mongoose
// const { ObjectId } = Schema.Types

let schema = {
  // base64
  img: {
    type: String
  },

  // 圖片url
  url: {
    type: String,
    required: true
  },

  // 圖片名稱
  name: {
    type: String,
    required: true
  },

  // 自動 id
  id: {
    type: Number,
    index: true,
    unique: true
  }
}

schema = new Schema(schema)
schema.index({ video: 1, time: 1 })

setAutoIncrement(schema, {
  model: 'Images',
  field: 'id'
})

schema.plugin(Base)

module.exports = model('Images', schema)
