function authApi(request) {
  return {
    login(data, config) {
      return request.post('/auth/login', data, config)
    },
    logout(data, config = {}) {
      config.withToken = true
      return request.post('/auth/logout', data, config)
    },
    register(data, config) {
      return request.post('/auth/register', data, config)
    },
    getOssToken(data, config = {}) {
      config.withToken = true
      return request.get('/auth/oss/token', data, config)
    }
  }
}

export default authApi
