import store from '@/store'

export const mixin = {
  methods: {
    checkedAb(key) {
      return !store.state.user.userInfo?.roles.points.includes(key)
    }
  }
}
