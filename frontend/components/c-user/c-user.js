import axios from 'axios'
import placeholderProfilePic from '../../icons/person'
import store from '../../js/store/store'
import { customElement, html, LitEl, property } from '../_LitEl/LitEl'
import './c-user.scss'

@customElement('c-user')
class Component extends LitEl {
  @property({ type: Object }) user = {}

  @property({ type: Boolean }) loading = false

  @property({ type: Boolean }) request = false

  @property({ type: Boolean }) accepted = false

  followUser() {
    if (this.loading) return

    this.loading = true

    if (
      this.user.follow_request_id === null ||
      this.user.follow_request_id === undefined
    ) {
      // Request to follow
      axios
        .post(`/api/v1/followrequests`, {
          target: this.user.id
        })
        .then((res) => {
          notif('Follow requested')
          console.log('Follow requested:', res.data.data)
          this.user.follow_request_id = res.data.data.id
        })
        .catch((err) => {
          console.log(err.response.data.error)
          notif(err.response.data.error, 'error')
        })
        .then(() => {
          this.loading = false
        })
    } else {
      // Remove request
      axios
        .delete(`/api/v1/followrequests/${this.user.follow_request_id}`)
        .then((res) => {
          notif('Request deleted.')
          this.user.follow_request_id = null
        })
        .catch((err) => {
          console.log(err.response.data.error)
          notif(err.response.data.error, 'error')
        })
        .then(() => {
          this.loading = false
        })
    }
  }

  acceptRequest() {
    if (this.loading) return
    this.loading = true

    axios
      .get(`/api/v1/followrequests/${this.user.request_id}/accept`)
      .then((res) => {
        notif(`${this.user.first_name} ${this.user.last_name} now follows you.`)
        this.accepted = true
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
        this.request = false
      })
  }

  declineRequest() {
    if (this.loading) return
    this.loading = true

    axios
      .get(`/api/v1/followrequests/${this.user.request_id}/decline`)
      .then((res) => {
        notif(`Request declined.`)
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
        this.request = false
      })
  }

  unfollow() {
    if (this.loading) return
    this.loading = true

    axios
      .delete(`/api/v1/users/${this.user.id}/unfollow`)
      .then((res) => {
        notif(`User unfollowed`)
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
        this.request = false
        this.user.following_id = undefined
      })
  }

  render() {
    return html`
      ${this.user.image
        ? html`<img src="${this.user.image}" />`
        : placeholderProfilePic}

      <p class="name" @click=${() => navigate(`/user?u=${this.user.id}`)}>
        ${this.user.first_name} ${this.user.last_name}
      </p>

      ${this.renderButtons()}
    `
  }

  renderButtons() {
    // Can't follow yourself
    if (this.user.id === store.user.id) return ''

    if (this.accepted) {
      return html`<p class="follows-you">follows you.</p>`
    }

    if (this.request) {
      return html`
        <button
          class="btn-primary"
          @click=${this.acceptRequest}
          ?disabled=${this.loading}
        >
          Accept
        </button>
        <button
          class="btn-negative"
          @click=${this.declineRequest}
          ?disabled=${this.loading}
        >
          Decline
        </button>
      `
    }

    if (
      this.user.following_id !== undefined &&
      this.user.following_id !== null
    ) {
      return html`
        <button
          class="btn-negative"
          @click=${this.unfollow}
          ?disabled=${this.loading}
        >
          Unfollow
        </button>
      `
    }

    return html`
      <button
        class="btn-primary"
        @click=${this.followUser}
        ?disabled=${this.loading}
      >
        ${this.user.follow_request_id === null ||
        this.user.follow_request_id === undefined
          ? 'Follow'
          : 'Requested'}
      </button>
    `
  }
}
