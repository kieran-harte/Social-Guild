import { customElement, html, LitEl } from '../_LitEl/LitEl'
import './c-header.scss'

@customElement('c-header')
class Header extends LitEl {
  render() {
    return html`
      <div class="inner">
        <h1 id="title">Social Guild</h1>
        <div id="buttons">
          <a onclick="navigate('/about')">About</a>
          <a onclick="navigate('/signup')">Sign Up</a>
          <button class="btn-primary" onclick="navigate('/login')">
            LogIn
          </button>
        </div>
      </div>
    `
  }
}
