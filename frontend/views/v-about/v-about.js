import { customElement, html, LitEl } from '../../components/_LitEl/LitEl'
import './v-about.scss'

@customElement('v-about')
class View extends LitEl {
  render() {
    return html`
      <a id="home-btn" onclick="navigate('/')">Home</a>
      <h2>Created by</h2>
      <h1>Kieran Harte</h1>
    `
  }
}
