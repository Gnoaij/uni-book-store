function addressApi(request) {
  return {
    getInfo(data, config = {}) {
      config.withToken = true
      const id = data.id
      delete data.id
      return request.get(`/address/${id}`, data, config)
    },
    getList(data, config = {}) {
      config.withToken = true
      return request.get('/address', data, config)
    },
    add(data, config = {}) {
      config.withToken = true
      return request.post('/address', data, config)
    },
    updateInfo(data, config = {}) {
      config.withToken = true
      const id = data.id
      delete data.id
      return request.put(`/address/${id}`, data, config)
    },
    updateDefault(data, config = {}) {
      config.withToken = true
      const id = data.id
      delete data.id
      return request.patch(`/address/${id}/default`, data, config)
    },
    remove(data, config = {}) {
      config.withToken = true
      const id = data.id
      delete data.id
      return request.delete(`/address/${id}`, data, config)
    }
  }
}

export default addressApi
