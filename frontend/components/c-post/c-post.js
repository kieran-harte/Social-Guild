import axios from 'axios'
import commentIcon from '../../icons/comment'
import deleteIcon from '../../icons/delete'
import editIcon from '../../icons/edit'
import favIcon from '../../icons/fav'
import favOutline from '../../icons/fav-outline'
import profilePicPlaceholder from '../../icons/person'
import store from '../../js/store/store'
import { customElement, html, LitEl, property, query } from '../_LitEl/LitEl'
import './c-post.scss'

require('../c-modal/c-modal')
require('../c-comments/c-comments')
require('../c-edit-post/c-edit-post')

const moment = require('moment')

window.moment = moment

@customElement('c-post')
class Component extends LitEl {
  @property({ type: Object }) post = {}

  @property({ type: Boolean }) loading = false

  @query('#modal') modal

  @query('c-comments') commentsList

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

  deletePost() {
    if (this.loading) return

    this.loading = true

    axios
      .delete(`/api/v1/posts/${this.post.id}`)
      .then((res) => {
        store.setFeed(store.feed.filter((p) => p.id !== this.post.id))

        notif('Post deleted')
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
      })
  }

  editPost() {
    this.modal.slot = html`
      <c-edit-post
        @edit-modal-close=${this.modal.toggle}
        .post=${this.post}
      ></c-edit-post>
    `
    this.modal.toggle()
  }

  showComments() {
    this.modal.toggle()
    this.modal.slot = html` <c-comments .postId=${this.post.id}></c-comments> `
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

      ${this.renderContent()}

      <div id="interaction-info">
        <!-- Edit and delete buttons if our post -->
        ${this.post.user_id === store.user.id
          ? html`
              <div id="delete" @click=${this.deletePost}>${deleteIcon}</div>
              <div id="edit" @click=${this.editPost}>${editIcon}</div>
            `
          : ''}

        <div
          id="likes"
          ?liked=${this.post.my_like_id}
          @click=${this.post.my_like_id ? this.unlike : this.like}
        >
          ${this.post.like_count} ${this.post.my_like_id ? favIcon : favOutline}
        </div>
        <div id="comments" @click=${this.showComments}>
          ${this.post.comment_count} ${commentIcon}
        </div>
      </div>

      <c-modal id="modal"> </c-modal>
    `
  }

  renderContent() {
    if (this.post.type === 'text') {
      return html` <div id="content">${this.post.content}</div> `
    }

    if (this.post.type === 'image') {
      return html`
        <img src="${this.post.media}" alt="" />
        ${this.post.content
          ? html` <div id="content">${this.post.content}</div> `
          : ''}
      `
    }

    return html`
      <video controls src="${this.post.media}" alt=""></video>
      ${this.post.content
        ? html` <div id="content">${this.post.content}</div> `
        : ''}
    `
  }
}
