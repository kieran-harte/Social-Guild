import { makeAutoObservable } from 'mobx'

class Store {
  constructor() {
    makeAutoObservable(this)
    this.init()
  }

  user = {}

  async init() {}

  setUser(user) {
    this.user = user
  }

  get followingCount() {
    return this.user.following.length
  }

  get followersCount() {
    return this.user.followers.length
  }
}

export default new Store()
