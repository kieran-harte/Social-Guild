/* eslint-disable camelcase */
import { query } from 'lit-element'
import image from '../../images/svg/undraw_social_life'
import store from '../../js/store/store'
import { customElement, html, LitEl, property } from '../_LitEl/LitEl'
import './c-auth-form.scss'

const axios = require('axios')

@customElement('c-auth-form')
class Component extends LitEl {
  @property({ type: Boolean }) signup = false

  @property({ type: Boolean }) loading = false

  @query('#first_name') first_name

  @query('#last_name') last_name

  @query('#email ') email

  @query('#password') password

  @query('#confirm_password') confirm_password

  login(e) {
    e.preventDefault()

    this.loading = true

    axios
      .post('/api/v1/auth/login', {
        email: this.email.value,
        password: this.password.value
      })
      .then((res) => {
        if (res.data.success) {
          console.log(res.data)
          store.user = res.data.user
          localStorage.logged_in = true
          window.navigate('/home')
        } else {
          window.notif('Could not sign in.', 'error')
        }
      })
      .catch((err) => {
        window.notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
      })
  }

  signupUser(e) {
    e.preventDefault()

    // Check passwords match
    if (this.password.value !== this.confirm_password.value) {
      return this.confirm_password.setAttribute('invalid', true)
    }

    this.loading = true

    axios
      .post('/api/v1/auth/register', {
        first_name: this.first_name.value,
        last_name: this.last_name.value,
        email: this.email.value,
        password: this.password.value
      })
      .then((res) => {
        console.log(res.data)
        if (res.data.success) {
          store.user = res.data.user
          localStorage.logged_in = true
          window.navigate('/home')
        } else {
          window.notif('Could not create account', 'error')
        }
      })
      .catch((err) => {
        window.notif(err.response.data.error, 'error')
      })
      .then(() => {
        this.loading = false
      })
  }

  render() {
    return html`
      <h1 id="title">${this.signup ? 'Sign Up' : 'Log In'}</h1>
      ${this.signup ? this.renderSignup() : this.renderLogin()}
      <div id="divider"></div>
      <span class="image"> ${image} </span>
    `
  }

  renderLogin() {
    return html`
      <form @submit=${this.login}>
        <fieldset ?disabled=${this.loading ? 'disabled' : false}>
          <label for="email">Email</label>
          <input required type="email" id="email" autocomplete="email" />
          <label for="password">Password</label>
          <input
            required
            type="password"
            id="password"
            autocomplete="current-password"
          />
          <input
            type="submit"
            class="btn-light"
            value="${this.loading ? 'Loading...' : 'Log In'}"
          />
        </fieldset>
      </form>
    `
  }

  renderSignup() {
    return html`
      <form @submit=${this.signupUser}>
        <fieldset ?disabled=${this.loading ? 'disabled' : false}>
          <label for="first_name">First Name</label>
          <input
            required
            type="text"
            id="first_name"
            autocomplete="given-name"
          />
          <label for="last_name">Last Name</label>
          <input
            required
            type="text"
            id="last_name"
            autocomplete="family-name"
          />
          <label for="email">Email</label>
          <input required type="email" autocomplete="email" id="email" />
          <label for="password">Password</label>
          <input
            required
            type="password"
            id="password"
            autocomplete="new-password"
          />
          <label for="confirm_password">Confirm Password</label>
          <input
            required
            type="password"
            id="confirm_password"
            autocomplete="new-password"
          />
          <input
            type="submit"
            class="btn-light"
            value="${this.loading ? 'Loading...' : 'Sign Up'}"
          />
        </fieldset>
      </form>
    `
  }
}
