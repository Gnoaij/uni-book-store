import {
  mapState
} from 'vuex'

import store, {
  mutationTypes
} from './index'

const mixin = {
  computed: {
    ...mapState(Object.keys(store.state))
  },
  methods: {
    vuex(name, value) {
      store.commit(mutationTypes.CHANGE_STATE, {
        name,
        value
      })
    }
  }
}

export default mixin
