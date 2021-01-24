/* eslint-disable camelcase */
import axios from 'axios'
import store from '../../js/store/store'
import { customElement, html, LitEl, property, query } from '../_LitEl/LitEl'
import './c-edit-info.scss'

@customElement('c-edit-info')
class Component extends LitEl {
  @query('#first_name') first_name

  @query('#last_name') last_name

  @query('#email ') email

  @property({ type: Boolean }) loading = false

  save(e) {
    e.preventDefault()

    axios
      .put('/api/v1/auth/updatedetails', {
        first_name: this.first_name.value.trim(),
        last_name: this.last_name.value.trim(),
        email: this.email.value.trim()
      })
      .then((res) => {
        const ev = new CustomEvent('edit-modal-close', {
          bubbles: true,
          composed: true
        })
        this.dispatchEvent(ev)

        store.user = { ...store.user, ...res.data.user }
        notif('Profile updated')
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
      <form @submit=${this.save}>
        <fieldset ?disabled=${this.loading ? 'disabled' : false}>
          <label for="first_name">First Name</label>
          <input
            required
            type="text"
            id="first_name"
            autocomplete="given-name"
            value=${store.user.first_name}
          />
          <label for="last_name">Last Name</label>
          <input
            required
            type="text"
            id="last_name"
            autocomplete="family-name"
            value=${store.user.last_name}
          />
          <label for="email">Email</label>
          <input
            required
            type="email"
            autocomplete="email"
            id="email"
            value=${store.user.email}
          />
          <input
            type="submit"
            class="btn-primary"
            value=${this.loading ? 'Saving...' : 'Save'}
          />
        </fieldset>
      </form>
    `
  }
}
