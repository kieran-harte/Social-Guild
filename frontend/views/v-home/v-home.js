import {
  customElement,
  html,
  LitEl,
  property
} from '../../components/_LitEl/LitEl'
import profilePicPlaceholder from '../../icons/person'
import wellbeingSvg from '../../images/svg/undraw_walking_outside'
import store from '../../js/store/store'
import './v-home.scss'

require('../../components/landing/c-header')
require('../../components/landing/c-footer')

@customElement('v-home')
class View extends LitEl {
  @property({ type: String }) tab = 'home'

  render() {
    return html`
      <header>
        <div class="container">
          <h1 id="title" onclick="navigate('/')">Social Guild</h1>
          <div id="content">
            <div id="my-info">
              ${store.user.image
                ? html`
                    <img id="my-profile-picture" src="" alt="Profile Picture" />
                  `
                : profilePicPlaceholder}

              <h2 id="my-name">Kieran Harte</h2>
              <button id="logout" class="btn-primary">Log Out</button>
              <div id="follow-info">
                <h3 id="my-followers-count">42 Followers</h3>
                <h3 id="my-following-count">56 Following</h3>
              </div>
            </div>

            <nav>
              <ul>
                <li ?active=${this.tab === 'home'}>Home</li>
                <li>Explore</li>
                <li>Your Profile</li>
                <li>Search</li>
                <li>Settings</li>
              </ul>
            </nav>

            <div id="duration-info">
              <h2>You've been online for</h2>
              <p>23 minutes</p>
              ${wellbeingSvg}
            </div>
          </div>
        </div>
      </header>
      <main></main>
      <aside></aside>

      <!-- <c-footer></c-footer> -->
    `
  }
}
