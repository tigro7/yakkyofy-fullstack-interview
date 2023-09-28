// @ts-check
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: ''
  }),
  actions: {},
  getters: {
    loggedIn: state => !!state.user
  }
})
