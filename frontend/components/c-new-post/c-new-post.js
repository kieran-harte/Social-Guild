import axios from 'axios'
import store from '../../js/store/store'
import { customElement, html, LitEl, property, query } from '../_LitEl/LitEl'
import './c-new-post.scss'

@customElement('c-new-post')
class Component extends LitEl {
  @property({ type: String }) type = 'text'

  @query('#text-content') text

  @property({ type: Boolean }) loading = false

  post() {
    if (this.type === 'text') {
      if (this.text.value.trim() === '') {
        return notif('Add some text to your post.', 'error')
      }
    }

    this.loading = true

    axios
      .post('/api/v1/posts', {
        type: this.type,
        content: this.text.value
      })
      .then((res) => {
        const newPost = res.data.data
        // Update list of posts in feed
        store.setFeed([newPost, ...store.feed])

        notif('Posted')
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
        store.addingPost = false
      })
  }

  render() {
    return html`<ul>
        <li
          ?active=${this.type === 'text'}
          @click=${() => {
            this.type = 'text'
          }}
        >
          Text
        </li>
        <li
          ?active=${this.type === 'image'}
          @click=${() => {
            this.type = 'image'
          }}
        >
          Image
        </li>
        <li
          ?active=${this.type === 'video'}
          @click=${() => {
            this.type = 'video'
          }}
        >
          Video
        </li>
      </ul>
      ${this.renderTab()}
      <button id="post-btn" class="btn-primary" @click=${this.post}>
        Post
      </button> `
  }

  renderTab() {
    if (this.type === 'text') {
      return this.renderText()
    }
    if (this.type === 'image') {
      return this.renderImage()
    }
    return this.renderVideo()
  }

  renderText() {
    return html`
      <textarea
        id="text-content"
        cols="30"
        rows="10"
        placeholder="Write a post..."
      ></textarea>
    `
  }

  renderImage() {
    return html`
      <div id="media-container">
        <button class="btn-primary">Choose Image</button>
      </div>
      <textarea
        id="media-caption"
        cols="30"
        rows="2"
        placeholder="Caption..."
      ></textarea>
    `
  }

  renderVideo() {
    return html`
      <div id="media-container">
        <button class="btn-primary">Choose Video</button>
      </div>
      <textarea
        id="media-caption"
        cols="30"
        rows="2"
        placeholder="Caption..."
      ></textarea>
    `
  }
}
