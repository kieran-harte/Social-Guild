import axios from 'axios'
import { makeAutoObservable } from 'mobx'

class Store {
  constructor() {
    makeAutoObservable(this)
    this.init()
  }

  user = {}

  feed = []

  addingPost = false

  feedLoading = false

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

  fetchFeed() {
    this.feedLoading = true

    axios
      .get('/api/v1/feed')
      .then((res) => {
        this.setFeed(res.data.data)
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.feedLoading = false
      })
  }

  setFeed(feed) {
    this.feed = feed
  }
}

export default new Store()
