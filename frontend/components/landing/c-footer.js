import { customElement, html, LitEl } from '../_LitEl/LitEl'
import './c-footer.scss'

@customElement('c-footer')
class Footer extends LitEl {
  render() {
    return html`
      <div class="inner">
        <div id="buttons">
          <a onclick="navigate('/about')">About</a>
          <a onclick="navigate('/api')">Developers (API)</a>
          <a onclick="navigate('/privacy')">Privacy</a>
          <a onclick="navigate('/contact')">Contact</a>
        </div>
      </div>
    `
  }
}
