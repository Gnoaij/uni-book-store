class Router {
  constructor() {
    this.routeType = {
      NAVIGATE_TO: 'navigateTo',
      REDIRECT_TO: 'redirectTo',
      SWITCH_TAB: 'switchTab',
      RE_LAUNCH: 'reLaunch',
      NAVIGATE_BACK: 'navigateBack'
    }
    this.beforeEach = undefined
    this.afterEach = undefined
    this.errorEach = undefined
  }

  _processJumpRoute(route, type) {
    const url = route.url = route.url ?? ''
    const options = route.options = route.options ?? {}

    const pages = getCurrentPages()
    const len = pages.length
    const fromRoute = pages[len - 1]

    const to = {
      url,
      options
    }
    const from = {
      url: '/' + fromRoute.route,
      options: fromRoute.options
    }

    const keys = Object.keys(options)
    if (keys.length > 0) {
      route.url = url + '?' + keys.map((key) => `${key}=${options[key]}`).join('&')
    }

    const _success = route.success
    const _fail = route.fail

    route.success = (res) => {
      if (typeof this.afterEach === 'function') {
        this.afterEach(to, from, res)
      }
      if (typeof _success === 'function') {
        _success(to, from, res)
      }
    }

    route.fail = (err) => {
      if (typeof this.errorEach === 'function') {
        this.errorEach(to, from, err)
      }
      if (typeof _fail === 'function') {
        _fail(to, from, err)
      }
    }

    const next = (newRoute, newType) => {
      if (newRoute && newType) {
        this._changeRoute(newRoute, newType)
      } else {
        uni[type](route)
      }
    }

    if (typeof this.beforeEach === 'function') {
      this.beforeEach(to, from, next)
    } else {
      next()
    }
  }

  _processBackRoute(route, type) {
    const delta = route.delta = route.delta ?? 1

    const pages = getCurrentPages()
    const len = pages.length
    const toRoute = len > delta ? pages[len - delta - 1] : pages[0]
    const fromRoute = pages[len - 1]

    const to = {
      url: '/' + toRoute.route,
      options: toRoute.options
    }
    const from = {
      url: '/' + fromRoute.route,
      options: fromRoute.options
    }

    const next = (newRoute, newType) => {
      if (newRoute && newType) {
        this._changeRoute(newRoute, newType)
      } else {
        uni[type](route)
      }
    }

    if (typeof this.beforeEach === 'function') {
      this.beforeEach(to, from, next)
    } else {
      next()
    }
  }

  _changeRoute(route = {}, type = this.routeType.NAVIGATE_TO) {
    if (type === this.routeType.NAVIGATE_BACK) {
      this._processBackRoute(route, type)
    } else {
      this._processJumpRoute(route, type)
    }
  }

  navigateTo(route) {
    this._changeRoute(route, this.routeType.NAVIGATE_TO)
  }

  redirectTo(route) {
    this._changeRoute(route, this.routeType.REDIRECT_TO)
  }

  switchTab(route) {
    this._changeRoute(route, this.routeType.SWITCH_TAB)
  }

  reLaunch(route) {
    this._changeRoute(route, this.routeType.RE_LAUNCH)
  }

  navigateBack(route) {
    this._changeRoute(route, this.routeType.NAVIGATE_BACK)
  }
}

export default Router
