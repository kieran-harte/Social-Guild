import axios from 'axios'
import store from '../../js/store/store'
import { customElement, html, LitEl, property, query } from '../_LitEl/LitEl'
import './c-new-post.scss'

@customElement('c-new-post')
class Component extends LitEl {
  @property({ type: String }) type = 'text'

  @query('#text-content') text

  @property({ type: Boolean }) loading = false

  @property({ type: Number })
  progress = 0

  @property({ type: String })
  state = 'normal'

  post(e) {
    e && e.preventDefault()

    if (this.type === 'text') {
      if (this.text.value.trim() === '') {
        return notif('Add some text to your post.', 'error')
      }
    } else {
      this.postMedia()
      return
    }

    this.loading = true

    axios
      .post('/api/v1/posts', {
        type: this.type,
        content: this.text.value
      })
      .then((res) => {
        const newPost = res.data.data
        newPost.first_name = store.user.first_name
        newPost.last_name = store.user.last_name
        newPost.image = store.user.image
        newPost.like_count = 0
        newPost.comment_count = 0
        newPost.my_like_id = null
        newPost.user_id = store.user.id

        // Update list of posts in feed
        store.setFeed([newPost, ...store.feed])

        notif('Posted')
        store.addingPost = false
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
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
        <form
          id="image-upload-form"
          @submit=${this.uploadFiles}
          method="POST"
          enctype="multipart/form-data"
        >
          <input
            type="file"
            class="btn-primary"
            name="inputFile"
            id="inputFile"
            accept="image/*"
          />
          <input style="display:none" type="text" name="type" value="image" />
          <input
            style="display:none"
            type="text"
            name="content"
            id="media-caption-form"
          />
        </form>
        ${this.renderProgress()}
      </div>
      <textarea
        id="media-caption"
        cols="30"
        rows="2"
        placeholder="Caption..."
        @change=${(e) => {
          this.querySelector('#media-caption-form').value = this.querySelector(
            '#media-caption'
          ).value
        }}
      ></textarea>
    `
  }

  renderVideo() {
    return html`
      <div id="media-container">
        <form
          id="image-upload-form"
          @submit=${this.uploadFiles}
          method="POST"
          enctype="multipart/form-data"
        >
          <input
            type="file"
            class="btn-primary"
            name="inputFile"
            id="inputFile"
            accept="video/*"
          />
          <input style="display:none" type="text" name="type" value="video" />
          <input
            style="display:none"
            type="text"
            name="content"
            id="media-caption-form"
          />
        </form>
        ${this.renderProgress()}
      </div>
      <textarea
        id="media-caption"
        cols="30"
        rows="2"
        placeholder="Caption..."
        @change=${(e) => {
          this.querySelector('#media-caption-form').value = this.querySelector(
            '#media-caption'
          ).value
        }}
      ></textarea>
    `
  }

  renderProgress() {
    if (this.state === 'uploading')
      return html` Uploading... ${this.progress}% `

    if (this.state === 'processing') return html`Processing... Please wait`

    return ''
  }

  postMedia() {
    this.state = 'uploading'
    this.loading = true

    const form = this.querySelector('#image-upload-form')
    const data = new FormData(form)
    data.type = 'image'

    axios
      .request({
        method: 'post',
        url: `/api/v1/posts/media`,
        data,
        onUploadProgress: (p) => {
          const percent = Math.floor((p.loaded / p.total) * 100)
          this.progress = percent
          if (percent === 100) {
            this.state = 'processing'
          }
        }
      })
      .then((res) => {
        const newPost = res.data.data
        newPost.first_name = store.user.first_name
        newPost.last_name = store.user.last_name
        newPost.image = store.user.image
        newPost.like_count = 0
        newPost.comment_count = 0
        newPost.my_like_id = null
        newPost.user_id = store.user.id

        // Update list of posts in feed
        store.setFeed([newPost, ...store.feed])

        notif('Posted')
        store.addingPost = false
        this.state = 'normal'
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
      })
  }
}
