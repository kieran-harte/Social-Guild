import axios from 'axios'
import { makeAutoObservable } from 'mobx'

class Store {
  constructor() {
    makeAutoObservable(this)
    this.init()
  }

  user = {}

  async init() {}

  fetchUserDetails() {
    axios
      .get('/api/v1/auth/mydetails')
      .then((res) => {
        this.setUser(res.data.user)
      })
      .catch((err) => {
        console.error(err.response.data.error)
        notif('Not logged in', 'error')
        localStorage.clear('logged_in')
        navigate('/login')
      })
  }

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
