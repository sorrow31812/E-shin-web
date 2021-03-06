const redis = require('redis')
const bluebird = require('bluebird')
const to = require('await-to-js').default
const _ = require('lodash')

bluebird.promisifyAll(redis)
let clients = {}
let keyPrefix = ''
const redisConnect = {
  init (setting) {
    let promise = []
    const { hosts, prefix } = setting
    if (prefix) keyPrefix = prefix
    for (let conf of hosts) {
      promise.push(new Promise((resolve, reject) => {
        clients[conf.name] = redis.createClient(conf)
        clients[conf.name].on('error', reject)
        clients[conf.name].on('connect', () => {
          console.log('redis connected!')
          return resolve()
        })
      }))
    }

    return Promise.all(promise)
  },
  async get (key, options = {}) {
    if (!key || _.isUndefined(key)) return null
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    let [err, val] = await to(clients[name].getAsync(key))
    if (err) throw err
    return val
  },
  async exists (key, options = {}) {
    if (!key || _.isUndefined(key)) return null
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    return new Promise((resolve, reject) => {
      clients[name].exists(key, (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  },
  async set (key, value, options = {}) {
    if (!value) return
    let { prefix, name, cacheTime } = options
    cacheTime = cacheTime || 60 * 60 * 12
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    clients[name].set(key, value, 'EX', cacheTime)
  },
  async del (key, options = {}) {
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    clients[name].del(key)
  },
  async keys (key, options = {}) {
    if (!key || _.isUndefined(key)) return null
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    const m = clients[name].multi()

    m.keys(key)
    return m.execAsync()
  },
  async mget (keys, options = {}) {
    if (!keys || _.isUndefined(keys)) return null
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      keys = keys.map(k => `${prefix}${k}`)
    } else {
      keys = keys.map(k => `${keyPrefix}${k}`)
    }

    const m = clients[name].multi()
    keys.forEach(k => m.get(k))
    return m.execAsync()
  },
  async sget (key, options = {}) {
    if (!key || _.isUndefined(key)) return null
    let { prefix, name, db: dbNumber } = options
    name = name || 'default'
    dbNumber = dbNumber || 0
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    const m = clients[name].multi()
    m.select(dbNumber)
    m.get(key)
    m.select(0)
    return m.execAsync()
  },
  async sset (key, value, options = {}) {
    if (!key || _.isUndefined(key)) return null
    let { prefix, name, db: dbNumber, cacheTime } = options
    name = name || 'default'
    dbNumber = dbNumber || 0
    cacheTime = cacheTime || 60 * 60 * 12
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    const m = clients[name].multi()
    m.select(dbNumber)
    m.set(key, value, 'EX', cacheTime)
    m.select(0)
    return m.execAsync()
  },
  async sdel (key, options = {}) {
    let { prefix, name, db: dbNumber } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    const m = clients[name].multi()
    m.select(dbNumber)
    m.del(key)
    m.select(0)
    return m.execAsync()
  },
  hget (key, field, options = {}) {
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }

    return new Promise((resolve, reject) => {
      clients[name].hget(key, field, (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  },
  async hset (key, field, value, options = {}) {
    if (!value) return
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    clients[name].hset(key, field, value)
  },
  hgetall (key, options = {}) {
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }

    return new Promise((resolve, reject) => {
      clients[name].hgetall(key, (err, result) => {
        if (err) {
          return reject(err)
        }

        return resolve(result)
      })
    })
  },
  async hdel (key, field, options = {}) {
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    clients[name].hdel(key, field)
  },
  async lpush (key, data, options = {}) {
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    clients[name].lpush(key, data)
  },
  async rpush (key, data, options = {}) {
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    clients[name].rpush(key, data)
  },
  async lpop (key, options = {}) {
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    return new Promise((resolve, reject) => {
      clients[name].lpop(key, (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  },
  async rpop (key, options = {}) {
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    return new Promise((resolve, reject) => {
      clients[name].rpop(key, (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  },
  async lindex (key, idx = 0, options = {}) {
    let { prefix, name } = options
    name = name || 'default'
    if (prefix || prefix === '') {
      key = `${prefix}${key}`
    } else {
      key = `${keyPrefix}${key}`
    }
    return new Promise((resolve, reject) => {
      clients[name].lindex(key, idx, (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  }
}

module.exports = redisConnect
