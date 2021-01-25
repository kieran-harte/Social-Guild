import axios from 'axios'
import store from '../../js/store/store'
import { customElement, html, LitEl, property } from '../_LitEl/LitEl'
import './c-change-profile-picture.scss'

@customElement('c-change-profile-picture')
class Component extends LitEl {
  @property({ type: Number }) progress = 0

  @property({ type: Boolean }) loading = false

  @property({ type: String }) state = 'normal'

  render() {
    return html`
		<form
          id="image-upload-form"
          @submit=${this.uploadPic}
          method="POST"
          enctype="multipart/form-data"
        >
          <input
            type="file"
            class="btn-primary"
            name="inputFile"
            id="inputFile"
					/>
					<input type="submit" class="btn-primary" value="Upload">
        </form>
        ${this.renderProgress()}
      </div>
		`
  }

  renderProgress() {
    if (this.state === 'uploading')
      return html` Uploading... ${this.progress}% `

    if (this.state === 'processing') return html`Processing... Please wait`

    return ''
  }

  uploadPic(e) {
    e.preventDefault()

    this.state = 'uploading'
    this.loading = true

    const form = this.querySelector('#image-upload-form')
    const data = new FormData(form)
    data.type = 'image'

    axios
      .request({
        method: 'post',
        url: `/api/v1/users/uploadprofilepicture`,
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
        this.state = 'normal'

        store.user = { ...store.user, ...res.data.user }

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
}
