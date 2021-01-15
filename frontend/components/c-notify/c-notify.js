import { customElement, html, LitEl } from '../_LitEl/LitEl'
import './c-notify.scss'

@customElement('c-notify')
class Notif extends LitEl {
  render() {
    return html` <div id="notif"></div> `
  }
}

window.notif = (text) => {
  clearTimeout(window.notifTimeout)

  const app = document.querySelector('app-root')
  if (!app) return
  const comp = app.querySelector('c-notify')
  if (!comp) return
  const el = comp.querySelector('#notif')
  if (!el) return
  el.innerText = text
  el.setAttribute('visible', 'true')

  window.notifTimeout = setTimeout(
    () => {
      el.removeAttribute('visible')
    },
    2500,
    el
  )
}
