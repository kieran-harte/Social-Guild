import axios from 'axios'
import moment from 'moment'
import deleteIcon from '../../icons/delete'
import placeholderProfilePic from '../../icons/person'
import store from '../../js/store/store'
import { customElement, html, LitEl, property, query } from '../_LitEl/LitEl'
import './c-comments.scss'

@customElement('c-comments')
class Component extends LitEl {
  @property({ type: Boolean }) loading = false

  @property({ type: Boolean }) commentsLoading = false

  @property({ type: Number }) postId

  @property({ type: Array }) comments = []

  @query('#new-comment-content') newCommentContent

  connectedCallback() {
    super.connectedCallback()

    this.getComments()
  }

  getComments() {
    this.commentsLoading = true

    axios
      .get(`/api/v1/comments/${this.postId}`)
      .then((res) => {
        this.comments = res.data.data
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.commentsLoading = false
      })
  }

  postComment() {
    if (this.loading) return
    this.loading = true

    if (this.newCommentContent.value.trim() === '') {
      notif(`Your comment can't be blank`, 'error')
      return
    }

    axios
      .post(`/api/v1/comments/${this.postId}`, {
        content: this.newCommentContent.value.trim()
      })
      .then((res) => {
        console.log(res.data.data)
        const newComment = res.data.data
        newComment.first_name = store.user.first_name
        newComment.last_name = store.user.last_name
        newComment.image = store.user.image
        newComment.user_id = store.user.id

        this.comments = [res.data.data, ...this.comments]

        // Update number of comments on post
        store.setFeed(
          store.feed.map((p) => {
            if (p.id === this.postId) {
              p.comment_count += 1
            }
            return p
          })
        )

        this.newCommentContent.value = ''
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
      })
  }

  deleteComment(commentId) {
    if (this.loading) return

    this.loading = true

    axios
      .delete(`/api/v1/comments/${commentId}`)
      .then((res) => {
        // store.setFeed(store.feed.filter((p) => p.id !== this.post.id))
        this.comments = this.comments.filter((c) => c.id !== commentId)
        // Update number of comments on post
        store.setFeed(
          store.feed.map((p) => {
            if (p.id === this.postId) {
              p.comment_count -= 1
            }
            return p
          })
        )
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
      })
  }

  render() {
    if (this.commentsLoading) {
      return html`<div id="loading">Loading...</div>`
    }

    return html`
      <div id="comments-list">
        ${this.comments.length
          ? this.comments.map(
              (comment) => html`
                <div id="comment">
                  <div class="left">
                    <div
                      class="name"
                      @click=${() => navigate(`/user?u=${comment.user_id}`)}
                    >
                      ${comment.image
                        ? html`<img src="${comment.image}" />`
                        : placeholderProfilePic}
                      ${comment.first_name} ${comment.last_name}
                    </div>
                    <div class="time">
                      ${moment(+comment.created_at).fromNow()}
                    </div>
                    <div class="content">${comment.content}</div>
                  </div>
                  <div class="right">
                    <!-- Edit and delete buttons if our comment -->
                    ${comment.user_id === store.user.id
                      ? html`
                          <div
                            id="delete"
                            @click=${() => this.deleteComment(comment.id)}
                          >
                            ${deleteIcon}
                          </div>
                        `
                      : ''}
                  </div>
                </div>
              `
            )
          : 'No Comments'}
      </div>

      <div id="new-comment">
        <textarea
          id="new-comment-content"
          cols="30"
          rows="3"
          placeholder="Type your comment..."
        ></textarea>
        <button
          class="btn-primary"
          @click=${this.postComment}
          ?disabled=${this.loading}
        >
          Post
        </button>
      </div>
    `
  }
}
