import { customElement, html, property } from 'lit-element'
import {} from '../components/c-loading/c-loading'
import {} from '../components/c-notify/c-notify'
import { LitEl } from '../components/_LitEl/LitEl'
import Router from '../js/router/Router'
import routes from './routes'

@customElement('app-root')
class App extends LitEl {
  @property()
  viewContent = html` <p>Loading...</p> `

  constructor() {
    super()

    // Create router
    this.router = new Router(this, routes)

    window.navigate(window.location.pathname + window.location.search, true)
  }

  render() {
    return html` <c-loading></c-loading>
      <c-notify></c-notify>
      <div>${this.viewContent}</div>`
  }
}
