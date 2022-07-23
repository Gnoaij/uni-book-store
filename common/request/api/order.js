function orderApi(request) {
  return {
    getPreview(data, config = {}) {
      config.withToken = true
      return request.get('/orders/preview', data, config)
    }
  }
}

export default orderApi
