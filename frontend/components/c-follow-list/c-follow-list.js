import axios from 'axios'
import { customElement, html, LitEl, property } from '../_LitEl/LitEl'
import './c-follow-list.scss'

@customElement('c-follow-list')
class Component extends LitEl {
  @property({ type: Array }) followers = []

  @property({ type: Array }) following = []

  @property({ type: Boolean }) loading = false

  @property({ type: Number }) userId

  connectedCallback() {
    super.connectedCallback()
    this.fetchFollowStats()
  }

  async fetchFollowStats() {
    this.loading = true

    try {
      this.following = (
        await axios.get(`/api/v1/users/${this.userId}/following`)
      ).data.data
      this.followers = (
        await axios.get(`/api/v1/users/${this.userId}/followers`)
      ).data.data
      console.log(this.followers)
    } catch (error) {
      console.log(error)
    }

    this.loading = false
  }

  render() {
    if (this.loading) return html`Loading...`
    return html`
      <div id="followers">
        <h2>Followers</h2>
        ${this.followers.map((u) => html` <c-user .user=${u}></c-user>`)}
      </div>
      <div id="following">
        <h2>Following</h2>
        ${this.following.map((u) => html` <c-user .user=${u}></c-user>`)}
      </div>
    `
  }
}
