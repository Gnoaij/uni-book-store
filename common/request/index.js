import Request from '@/utils/request'

import defaultConfig from './config'

import addressApi from './api/address'
import authApi from './api/auth'
import cartApi from './api/cart'
import goodsApi from './api/goods'
import homeApi from './api/home'
import orderApi from './api/order'
import userApi from './api/user'

function install(Vue, vm) {
  // 请求实例
  const instance = new Request(defaultConfig)

  // 模拟patch
  instance.patch = (url = '', data = {}, config = {}) => {
    data._method = 'PATCH'
    return instance.post(url, data, config)
  }

  // 请求拦截
  instance.interceptor.request = (config) => {
    if (config.loading) {
      uni.showLoading(config.loading)
    }
    if (config.withToken) {
      config.header.Authorization = `Bearer ${vm.vuex_token}`
    }
    return config
  }

  // 响应拦截
  instance.interceptor.response = (res) => {
    const {
      statusCode,
      data,
      _config
    } = res

    if (_config.loading) {
      uni.hideLoading()
    }

    if (statusCode < 400) {
      if (_config.toast) {
        uni.showToast(_config.toast)
      }
      return data
    }

    if (statusCode === 401) {
      const message = data.message
      if (message === 'Unauthorized') {
        uni.showToast({
          icon: 'error',
          title: '邮箱或密码错误'
        })
      } else {
        uni.showToast({
          icon: 'error',
          title: '身份验证失败，请重新登录'
        })
      }
    } else if (statusCode === 422) {
      const message = (Object.values(data.errors ?? {})[0] ?? [])[0]
      uni.showToast({
        icon: 'error',
        title: typeof message === 'string' ? message : '参数错误，请检查后重试'
      })
    } else {
      const message = data.message
      uni.showToast({
        icon: 'error',
        title: typeof message === 'string' ? message : '请求失败，请重试'
      })
    }
    return Promise.reject(res)
  }

  // 失败拦截
  instance.interceptor.fail = (err) => {
    if (err._config.loading) {
      uni.hideLoading()
    }
    uni.showToast({
      icon: 'error',
      title: '请求失败，请重试'
    })
    return err
  }

  // 原型挂载
  Vue.prototype.$_request = instance
  Vue.prototype.$_api = {
    address: addressApi(instance),
    auth: authApi(instance),
    cart: cartApi(instance),
    goods: goodsApi(instance),
    home: homeApi(instance),
    order: orderApi(instance),
    user: userApi(instance)
  }
}

export default install
