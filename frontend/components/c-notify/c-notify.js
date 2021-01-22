import { customElement, html, LitEl } from '../_LitEl/LitEl'
import './c-notify.scss'

@customElement('c-notify')
class Notif extends LitEl {
  render() {
    return html` <div id="notif"></div> `
  }
}

window.notif = (text, type) => {
  if (!text) return

  clearTimeout(window.notifTimeout)

  const el = document.querySelector('c-notify #notif')
  if (!el) return

  el.innerText = text
  el.setAttribute('visible', 'true')

  el.classList = []
  if (type) el.classList.add(type)

  window.notifTimeout = setTimeout(
    () => {
      el.removeAttribute('visible')
    },
    2500,
    el
  )
}
