import { LitNotify, LitSync } from '@morbidick/lit-element-notify'
import { css, customElement, html, LitElement, property } from 'lit-element'
import { render } from 'lit-html'
// CSS Reset
import cssMain from '../../app/styles/main-css'

class LitEl extends LitSync(LitNotify(LitElement)) {
  static get styles() {
    return [cssMain]
  }

  createRenderRoot() {
    return this
  }
}

export {
  LitElement,
  LitEl,
  css,
  html,
  render,
  LitSync,
  LitNotify,
  customElement,
  property
}
