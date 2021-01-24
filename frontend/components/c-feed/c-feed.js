import store from '../../js/store/store'
import { customElement, html, LitEl, property } from '../_LitEl/LitEl'
import './c-feed.scss'

require('../c-post/c-post')
require('../c-new-post/c-new-post')

@customElement('c-feed')
class Component extends LitEl {
  @property({ type: Number }) userId

  connectedCallback() {
    super.connectedCallback()
    store.fetchFeed(this.userId)
  }

  render() {
    return html`
      ${this.userId === undefined || this.userId === -1
        ? html`
            <button
              class="btn-primary"
              id="new-post-btn"
              ?square=${store.addingPost}
              @click=${() => {
                store.addingPost = !store.addingPost
              }}
            >
              ${store.addingPost ? 'x' : html`+ &nbsp;Post`}
            </button>
          `
        : ''}
      ${store.addingPost ? this.renderNewPost() : this.renderFeed()}
    `
  }

  renderNewPost() {
    return html`<p>New Post</p>
      <c-new-post></c-new-post> `
  }

  renderFeed() {
    if (store.feedLoading) {
      return html`Loading...`
    }

    return html`<div id="posts">
      ${!store.feed.length
        ? html`No Posts`
        : html`
            ${store.feed.map((post) => html` <c-post .post=${post}></c-post> `)}
          `}
    </div>`
  }
}
