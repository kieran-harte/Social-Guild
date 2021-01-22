import image from '../../images/svg/undraw_social_life'
import { customElement, html, LitEl, property } from '../_LitEl/LitEl'
import './c-auth-form.scss'

@customElement('c-auth-form')
class Component extends LitEl {
  @property({ type: Boolean }) signup = false

  login(e) {
    e.preventDefault()
    alert('login')
  }

  signupUser(e) {
    e.preventDefault()
    console.log('sign up user')
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
        <label for="email">Email</label>
        <input type="email" id="email" autocomplete="email" />
        <label for="password">Password</label>
        <input type="password" id="password" autocomplete="current-password" />
        <input type="submit" class="btn-light" value="Log In" />
      </form>
    `
  }

  renderSignup() {
    return html`
      <form @submit=${this.signupUser}>
        <label for="first_name">First Name</label>
        <input type="text" id="first_name" autocomplete="given-name" />
        <label for="last_name">Last Name</label>
        <input type="text" id="last_name" autocomplete="family-name" />
        <label for="email">Email</label>
        <input type="email" autocomplete="email" id="email" />
        <label for="password">Password</label>
        <input type="password" id="password" autocomplete="new-password" />
        <label for="confirm_password">Confirm Password</label>
        <input
          type="password"
          id="confirm_password"
          autocomplete="new-password"
        />
        <input type="submit" class="btn-light" value="Sign Up" />
      </form>
    `
  }
}
