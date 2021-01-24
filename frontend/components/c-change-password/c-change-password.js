import axios from 'axios'
import { customElement, html, LitEl, property, query } from '../_LitEl/LitEl'
import './c-change-password.scss'

@customElement('c-change-password')
class Component extends LitEl {
  @property({ type: Boolean }) loading = false

  @query('#password') password

  @query('#new_password') newPassword

  @query('#confirm_password') confirmPassword

  save(e) {
    e.preventDefault()

    if (this.newPassword.value !== this.confirmPassword.value) {
      notif('Passwords do not match.', 'error')
      return
    }

    axios
      .put('/api/v1/auth/updatepassword', {
        currentPassword: this.password.value,
        newPassword: this.newPassword.value
      })
      .then((res) => {
        const ev = new CustomEvent('edit-modal-close', {
          bubbles: true,
          composed: true
        })
        this.dispatchEvent(ev)
        notif('Password updated')
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
      })
  }

  render() {
    return html` <form @submit=${this.save}>
      <fieldset ?disabled=${this.loading ? 'disabled' : false}>
        <label for="password">Old Password</label>
        <input
          required
          type="password"
          id="password"
          autocomplete="current-password"
        />
        <label for="new_password">New Password</label>
        <input
          required
          type="password"
          id="new_password"
          autocomplete="new-password"
        />
        <label for="confirm_password">Confirm New Password</label>
        <input
          required
          type="password"
          id="confirm_password"
          autocomplete="new-password"
        />
        <input
          type="submit"
          class="btn-primary"
          value=${this.loading ? 'Saving...' : 'Save'}
        />
      </fieldset>
    </form>`
  }
}
