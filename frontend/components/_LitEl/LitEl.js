import { MobxLitElement } from '@adobe/lit-mobx'
import { LitNotify, LitSync } from '@morbidick/lit-element-notify'
import {
  css,
  customElement,
  html,
  LitElement,
  property,
  query
} from 'lit-element'
import { render } from 'lit-html'
// CSS Reset
import cssMain from '../../app/styles/main-css'

class LitEl extends LitSync(LitNotify(MobxLitElement)) {
  static get styles() {
    return [cssMain]
  }

  createRenderRoot() {
    return this
  }
}

export {
  css,
  html,
  query,
  LitEl,
  render,
  LitSync,
  property,
  LitNotify,
  LitElement,
  customElement,
  MobxLitElement
}
