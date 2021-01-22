import { customElement, html, LitEl } from '../../components/_LitEl/LitEl'
import money from '../../icons/money'
import security from '../../icons/security'
import wellbeing from '../../icons/wellbeing'
import blueWave from '../../images/svg/blueWave'
import hero from '../../images/svg/undraw_social_serenity'
import './v-home.scss'

require('../../components/landing/c-header')
require('../../components/landing/c-footer')

@customElement('v-home')
class View extends LitEl {
  render() {
    return html`
      <c-header></c-header>
      <section id="hero">
        <div id="text">
          <h1>A new era of <br />social <br />networking.</h1>
          <h2>Putting privacy, security, and wellbeing first.</h2>
          <button class="btn-primary" onclick="navigate('/signup')">
            Sign up for free
          </button>
        </div>
        ${hero}
      </section>

      <span class="wave">${blueWave}</span>
      <section id="second-section">
        <div class="info-card">
          <div class="icon">${security}</div>
          <h3>Privacy</h3>
          <p>
            At Social Guild, your privacy is one of our top priorities. With
            this in mind, we enable the maximum privacy settings by default on
            your account.
          </p>
        </div>
        <div class="info-card">
          <div class="icon">${money}</div>
          <h3>Non-profit</h3>
          <p>
            We're not trying to make money from you. We won't place ads. We
            won't sell your data.
          </p>
        </div>
        <div class="info-card">
          <div class="icon">${wellbeing}</div>
          <h3>Wellbeing</h3>
          <p>
            Unlike other social networks which profit from your addiction, we
            promote healthier interaction and remind you to take breaks.
          </p>
        </div>
      </section>
      <span class="wave flip">${blueWave}</span>

      <section id="third-section">
        <h1>Become part of a growing community.</h1>
        <h2>Sign up today, for free</h2>
        <button class="btn-primary" onclick="navigate('/signup')">
          Sign Up
        </button>
      </section>

      <c-footer></c-footer>
    `
  }
}
