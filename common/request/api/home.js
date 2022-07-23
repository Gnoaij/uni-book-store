function homeApi(request) {
  return {
    getList(data, config) {
      return request.get('/index', data, config)
    }
  }
}

export default homeApi
