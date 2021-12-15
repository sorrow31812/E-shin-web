const Sleep = {
  msleep (n) {
    return new Promise(resolve => setTimeout(resolve, n))
  },
  sleep (n) {
    return this.msleep(n * 1000)
  }
}

module.exports = Sleep
