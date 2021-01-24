import axios from 'axios'
import { makeAutoObservable } from 'mobx'

class Store {
  constructor() {
    makeAutoObservable(this)
  }

  user = {}

  feed = []

  notifications = []

  addingPost = false

  feedLoading = false

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

  fetchFeed(userId) {
    this.feedLoading = true

    let url
    // get my feed
    url = '/api/v1/feed'

    if (userId !== undefined) {
      // get a user's posts
      url = `/api/v1/users/${userId}/posts`
    }
    if (userId === -1) {
      // Get my posts
      url = `/api/v1/users/posts`
    }

    axios
      .get(url)
      .then((res) => {
        this.setFeed(res.data.data)
      })
      .catch((err) => {
        if (err.response.status !== 403) notif(err.response.data.error, 'error')
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
