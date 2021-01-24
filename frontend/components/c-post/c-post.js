import axios from 'axios'
import profilePicPlaceholder from '../../icons/person'
import { customElement, html, LitEl, property } from '../_LitEl/LitEl'
import './c-post.scss'

const moment = require('moment')

window.moment = moment

@customElement('c-post')
class Component extends LitEl {
  @property({ type: Object }) post = {}

  @property({ type: Boolean }) loading = false

  like() {
    if (this.loading) return

    this.loading = true

    axios
      .post(`/api/v1/likes/${this.post.id}`)
      .then((res) => {
        this.post.like_count += 1
        this.post.my_like_id = res.data.data.id
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
      })
  }

  unlike() {
    if (this.loading) return

    this.loading = true

    axios
      .delete(`/api/v1/likes/${this.post.id}`)
      .then((res) => {
        this.post.like_count -= 1
        this.post.my_like_id = null
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
      })
  }

  render() {
    return html`
      <div id="user-info">
        ${this.post.profile_pic
          ? html` <img src="${this.post.profile_pic}" alt="Profile Picture" /> `
          : profilePicPlaceholder}
        <div class="right">
          <div
            class="name"
            @click=${() => {
              navigate(`/user?u=${this.post.user_id}`)
            }}
          >
            ${this.post.first_name} ${this.post.last_name}
          </div>
          <div id="date">${moment(+this.post.created_at).fromNow()}</div>
        </div>
      </div>

      <div id="content">${this.post.content}</div>

      <div id="interaction-info">
        <div
          id="likes"
          ?liked=${this.post.my_like_id}
          @click=${this.post.my_like_id ? this.unlike : this.like}
        >
          ${this.post.like_count} likes
        </div>
        <div>${this.post.comment_count || 0} Comments</div>
      </div>
    `
  }
}
