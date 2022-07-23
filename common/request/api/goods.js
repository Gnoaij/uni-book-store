function goodsApi(request) {
  return {
    getInfo(data, config = {}) {
      config.withToken = true
      const id = data.id
      delete data.id
      return request.get(`/goods/${id}`, data, config)
    },
    getList(data, config) {
      return request.get('/goods', data, config)
    },
    getStarList(data, config = {}) {
      config.withToken = true
      return request.get('/collects', data, config)
    },
    updateStar(data, config = {}) {
      config.withToken = true
      const id = data.id
      delete data.id
      return request.post(`/collects/goods/${id}`, data, config)
    }
  }
}

export default goodsApi
