class Request {
  constructor(defaultConfig = {}) {
    this.defaultConfig = defaultConfig
    this.interceptor = {}
  }

  _request(url, data, config) {
    return new Promise(async (resolve, reject) => {
      const baseUrl = this.defaultConfig.baseUrl
      const lowestConfig = {
        header: {}
      }
      const highestConfig = {
        url: (baseUrl && !url.startsWith(baseUrl)) ? baseUrl + url : url,
        data
      }

      let _config = Object.assign(lowestConfig, this.defaultConfig, config, highestConfig)

      if (typeof this.interceptor.request === 'function') {
        try {
          _config = await this.interceptor.request(_config)
        } catch (e) {
          return reject(e)
        }
      }

      uni.request({
        ..._config,
        success: async (res) => {
          res._config = _config

          if (typeof this.interceptor.response === 'function') {
            try {
              res = await this.interceptor.response(res)
              return resolve(res)
            } catch (e) {
              return reject(e)
            }
          }

          if (res.statusCode < 400) {
            return resolve(res)
          }
          return reject(res)
        },
        fail: async (err) => {
          err._config = _config

          if (typeof this.interceptor.fail === 'function') {
            try {
              err = await this.interceptor.fail(err)
              return reject(err)
            } catch (e) {
              return reject(e)
            }
          }
        }
      })
    })
  }

  get(url = '', data = {}, config = {}) {
    config.method = 'GET'
    return this._request(url, data, config)
  }

  post(url = '', data = {}, config = {}) {
    config.method = 'POST'
    return this._request(url, data, config)
  }

  put(url = '', data = {}, config = {}) {
    config.method = 'PUT'
    return this._request(url, data, config)
  }

  delete(url = '', data = {}, config = {}) {
    config.method = 'DELETE'
    return this._request(url, data, config)
  }
}

export default Request
