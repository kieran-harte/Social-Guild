import { customElement, html, LitEl, property } from '../_LitEl/LitEl'
import './c-post.scss'

@customElement('c-post')
class Component extends LitEl {
  @property({ type: Object }) post = {}

  render() {
    return html` ${this.post.content} `
  }
}
