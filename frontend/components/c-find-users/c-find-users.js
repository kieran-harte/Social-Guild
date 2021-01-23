import axios from 'axios'
import { customElement, html, LitEl, property } from '../_LitEl/LitEl'
import './c-find-users.scss'

require('../c-user/c-user')

@customElement('c-find-users')
class Component extends LitEl {
  @property({ type: Array }) users = []

  @property({ type: Boolean }) loading = false

  connectedCallback() {
    super.connectedCallback()

    this.loading = true

    axios
      .get('/api/v1/users')
      .then((res) => {
        this.users = res.data.users
      })
      .catch((err) => {
        console.log(err.response.data.error, 'error')
        notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
      })
  }

  render() {
    return html`
      <h1 class="heading">Find Users</h1>
      <ul>
        ${this.users.map(
          (user) =>
            html`
              <li>
                <c-user .user=${user}></c-user>
              </li>
            `
        )}
      </ul>
    `
  }
}
