import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const VUEX_STATE = 'vuex_state'

const savedKeys = ['vuex_token', 'vuex_listLayout']

function isNeedToSave(key) {
  return savedKeys.includes(key)
}

function saveStateToStorage(key, value) {
  if (!isNeedToSave(key)) {
    return
  }
  const temp = uni.getStorageSync(VUEX_STATE)
  const savedState = temp ? temp : {}
  savedState[key] = value
  uni.setStorageSync(VUEX_STATE, savedState)
}

const mutationTypes = {
  INIT_STATE: 'initState',
  CHANGE_STATE: 'changeState'
}

const store = new Vuex.Store({
  state: {
    vuex_token: '',
    vuex_userInfo: {},
    vuex_cartList: [],
    vuex_addressId: '',
    vuex_listLayout: 2
  },
  mutations: {
    [mutationTypes.INIT_STATE](state) {
      const temp = uni.getStorageSync(VUEX_STATE)
      const savedState = temp ? temp : {}
      for (let key of savedKeys) {
        savedState[key] && (state[key] = savedState[key])
      }
    },
    [mutationTypes.CHANGE_STATE](state, {
      name,
      value
    }) {
      const nameArr = name.split('.')
      const len = nameArr.length
      if (len >= 2) {
        let targetObj = state[nameArr[0]]
        for (let i = 1; i < len - 1; i++) {
          targetObj = targetObj[nameArr[i]]
        }
        targetObj[nameArr[len - 1]] = value
        saveStateToStorage(nameArr[0], state[nameArr[0]])
      } else {
        state[name] = value
        saveStateToStorage(name, value)
      }
    }
  }
})

export default store

export {
  mutationTypes
}
