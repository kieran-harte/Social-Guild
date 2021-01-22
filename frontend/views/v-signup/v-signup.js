import { customElement, html, LitEl } from '../../components/_LitEl/LitEl'
import './v-signup.scss'

require('../../components/c-auth-form/c-auth-form')

@customElement('v-signup')
class View extends LitEl {
  render() {
    return html`
      <header>
        <h1 onclick="navigate('/')">Social Guild</h1>
        <button class="btn-primary" onclick="navigate('/login')">LogIn</button>
      </header>

      <div id="container">
        <c-auth-form signup></c-auth-form>
      </div>
    `
  }
}
