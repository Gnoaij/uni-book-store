import Router from '@/utils/router'

function install(Vue, vm) {
  const router = new Router()

  router.beforeEach = (to, from, next) => {
    next()
  }

  Vue.prototype.$_router = router
}

export default install
