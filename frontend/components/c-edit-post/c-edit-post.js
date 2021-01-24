import axios from 'axios'
import store from '../../js/store/store'
import { customElement, html, LitEl, property, query } from '../_LitEl/LitEl'
import './c-edit-post.scss'

@customElement('c-edit-post')
class Component extends LitEl {
  @property({ type: Boolean }) loading = false

  @property({ type: Object }) post = {}

  @property() close = () => {}

  @query('#content') text

  save() {
    if (this.loading) return

    if (this.type === 'text') {
      if (this.text.value.trim() === '') {
        return notif('Add some text to your post.', 'error')
      }
    }

    this.loading = true

    axios
      .put(`/api/v1/posts/${this.post.id}`, {
        type: this.post.type,
        content: this.text.value.trim()
      })
      .then((res) => {
        store.setFeed(
          store.feed.map((p) => {
            if (p.id === this.post.id) {
              p.content = res.data.data.content
            }

            return p
          })
        )

        const ev = new CustomEvent('edit-modal-close', {
          bubbles: true,
          composed: true
        })
        this.dispatchEvent(ev)
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
      <textarea id="content" cols="30" rows="10">${this.post.content}</textarea>

      <button class="btn-primary" id="post-btn" @click=${this.save}>
        Save
      </button>
    `
  }
}
