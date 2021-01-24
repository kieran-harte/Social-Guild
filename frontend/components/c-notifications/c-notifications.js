import store from '../../js/store/store'
import { customElement, html, LitEl } from '../_LitEl/LitEl'
import './c-notifications.scss'

require('../c-requests/c-requests')

@customElement('c-notifications')
class Component extends LitEl {
  render() {
    return html`
      <h2>Notifications</h2>
      <div id="list">
        ${store.notifications.length
          ? html`${store.notifications.map((n) => html`${n.text}`)}`
          : html`<div id="no-notif">No notifications</div>`}
      </div>

      <c-requests></c-requests>
    `
  }
}
