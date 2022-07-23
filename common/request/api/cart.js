function cartApi(request) {
  return {
    getList(data, config = {}) {
      config.withToken = true
      return request.get('/carts', data, config)
    },
    add(data, config = {}) {
      config.withToken = true
      return request.post('/carts', data, config)
    },
    remove(data, config = {}) {
      config.withToken = true
      const id = data.id
      delete data.id
      return request.delete(`/carts/${id}`, data, config)
    },
    updateChecked(data, config = {}) {
      config.withToken = true
      return request.patch('/carts/checked', data, config)
    },
    updateNum(data, config = {}) {
      config.withToken = true
      const id = data.id
      delete data.id
      return request.put(`/carts/${id}`, data, config)
    }
  }
}

export default cartApi
