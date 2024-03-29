import axios from 'axios'
import store from '../../js/store/store'
import { customElement, html, LitEl, property, query } from '../_LitEl/LitEl'
import './c-profile.scss'

require('../c-user/c-user')
require('../c-post/c-post')
require('../c-follow-list/c-follow-list')

@customElement('c-profile')
class Component extends LitEl {
  @property({ type: Object }) user = {}

  @property({ type: Boolean }) myProf = false

  @property({ type: Boolean }) loading = true

  @property({ type: Number }) userId

  @query('#modal') modal

  constructor() {
    super()

    if (window.params.page === 'user' && +window.params.u === store.user.id) {
      navigate('/profile', true)
    }
  }

  connectedCallback() {
    super.connectedCallback()

    store.setFeed([])

    this.getProfile()
  }

  getProfile() {
    this.loading = true

    let url

    if (window.params.page === 'user') {
      url = `/api/v1/users/${window.params.u}/profile`
    } else {
      url = `/api/v1/users/profile`
    }

    axios
      .get(url)
      .then((res) => {
        this.user = res.data.data

        store.fetchFeed(this.user.id)
        this.loading = false
      })
      .catch((err) => {
        if (err.response.status === 404) {
          notif('Profile not found', 'error')
        }
        navigate('/home')
      })
      .then(() => {})
  }

  showFollow() {
    this.modal.slot = html`
      <c-follow-list
        .userId=${this.user.id}
        @edit-modal-close=${this.modal.toggle}
      ></c-follow-list>
    `
    this.modal.toggle()
  }

  renderInfo() {
    if (!this.user.id === store.user.id) return ''

    return html` <div id="email">${this.user.email}</div> `
  }

  render() {
    if (this.loading || store.feedLoading) return html`Loading...`

    return html`
      <c-user id="user-card" .user=${this.user}></c-user>
      <div id="follow-stats" @click=${this.showFollow}>
        <c-modal id="modal"></c-modal>
        <span>${this.user.followers.count} Followers</span>
        <span>${this.user.following.count} Following</span>
      </div>

      ${this.renderInfo()}
      ${this.user.following_id === undefined && this.user.id !== store.user.id
        ? html` Private feed `
        : ''}
      <div id="posts">
        ${store.feed?.map((post) => html` <c-post .post=${post}></c-post> `)}
      </div>
    `
  }
}
