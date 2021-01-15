import { customElement, html, LitEl } from '../_LitEl/LitEl'
import './c-loading.scss'

@customElement('c-loading')
class Loading extends LitEl {
  static get styles() {
    return [super.styles]
  }

  render() {
    return html` <div id="loadingOverlay"></div> `
  }
}
