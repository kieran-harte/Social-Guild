import { customElement, html, LitEl } from '../../components/_LitEl/LitEl'
import './v-home.scss'

@customElement('v-home')
class View extends LitEl {
  render() {
    return html`
      <h1>Social Guild</h1>
      <a id="info-btn" onclick="navigate('/about')">About</a>
    `
  }
}
