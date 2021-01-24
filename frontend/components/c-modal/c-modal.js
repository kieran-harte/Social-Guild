import { customElement, html, LitEl, property } from '../_LitEl/LitEl'
import './c-modal.scss'

@customElement('c-modal')
class Component extends LitEl {
  @property({ type: Boolean, reflect: true }) open = false

  @property({ type: Boolean, reflect: true }) display = false

  @property() slot = html``

  origScrollPos = 0

  toggle() {
    if (this.open) {
      document.body.style.overflowY = 'auto'
    } else {
      document.body.style.overflowY = 'hidden'
    }

    if (this.open) {
      this.open = false
      setTimeout(() => {
        this.display = false
      }, 250)
    } else {
      this.display = true
      setTimeout(() => {
        this.open = true
      }, 10)
    }
  }

  render() {
    return html` <div id="closer" @click=${this.toggle}></div>
      <div id="content">${this.slot}</div>`
  }
}
