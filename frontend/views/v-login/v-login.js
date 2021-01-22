import { customElement, html, LitEl } from '../../components/_LitEl/LitEl'
import './v-login.scss'

require('../../components/c-auth-form/c-auth-form')

@customElement('v-login')
class View extends LitEl {
  render() {
    return html`
      <header>
        <h1 onclick="navigate('/')">Social Guild</h1>
        <button class="btn-primary" onclick="navigate('/signup')">
          Sign Up
        </button>
      </header>

      <div id="container">
        <c-auth-form></c-auth-form>
      </div>
    `
  }
}
