import axios from 'axios'
import { customElement, html, LitEl, property } from '../_LitEl/LitEl'
import './c-requests.scss'

@customElement('c-requests')
class Component extends LitEl {
  @property({ type: Array }) requests = []

  connectedCallback() {
    super.connectedCallback()

    axios
      .get('/api/v1/followrequests')
      .then((res) => {
        this.requests = res.data.data
      })
      .catch((err) => {
        notif(err.response.data.error, 'error')
      })
  }

  render() {
    return html` <h2>Follow Requests</h2>

      ${!this.requests.length
        ? html` <div id="no-follow-reqs">No requests</div> `
        : ''}
      ${this.requests.map(
        (user) =>
          html`
            <div class="request">
              <c-user request .user=${user}></c-user>
            </div>
          `
      )}`
  }
}
