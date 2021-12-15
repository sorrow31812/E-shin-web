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

  // 姓名
  name: {
    type: String,
    required: true
  },

  // 手機
  phone: {
    type: String
  },

  // 信箱
  mail: {
    type: String
  },

  // 留言
  desc: {
    type: Mixed
  }
}

schema = new Schema(schema)
schema.index({ id: -1, type: 1 })
setAutoIncrement(schema, {
  model: 'Contact',
  field: 'id'
})

schema.index({ id: 1 })
schema.plugin(Base)
module.exports = model('Contact', schema)
