function userApi(request) {
  return {
    getInfo(data, config = {}) {
      config.withToken = true
      return request.get('/user', data, config)
    },
    updateInfo(data, config = {}) {
      config.withToken = true
      return request.put('/user', data, config)
    },
    updateAvatar(data, config = {}) {
      config.withToken = true
      return request.patch('/user/avatar', data, config)
    }
  }
}

export default userApi
