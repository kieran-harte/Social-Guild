import moment from 'moment'
import {
  customElement,
  html,
  LitEl,
  property,
  query
} from '../../components/_LitEl/LitEl'
import profilePicPlaceholder from '../../icons/person'
import wellbeingSvg from '../../images/svg/undraw_walking_outside'
import store from '../../js/store/store'
import './v-home.scss'

require('../../components/landing/c-header')
require('../../components/landing/c-footer')
require('../../components/c-find-users/c-find-users')
require('../../components/c-notifications/c-notifications')
require('../../components/c-requests/c-requests')
require('../../components/c-feed/c-feed')
require('../../components/c-profile/c-profile')
require('../../components/c-settings/c-settings')
require('../../components/c-follow-list/c-follow-list')

@customElement('v-home')
class View extends LitEl {
  @property({ type: String }) tab = window.params.page || 'home'

  @query('#modal') modal

  constructor() {
    super()

    store.fetchUserDetails()
  }

  showFollow() {
    this.modal.slot = html`
      <c-follow-list
        .userId=${store.user.id}
        @edit-modal-close=${this.modal.toggle}
      ></c-follow-list>
    `
    this.modal.toggle()
  }

  render() {
    return html`
      <header>
        <div class="container">
          <h1 id="title" onclick="navigate('/')">Social Guild</h1>
          <div id="content">
            <div id="my-info">
              ${store.user?.image
                ? html`
                    <img
                      id="my-profile-picture"
                      src="${store.user.image}"
                      alt="Profile Picture"
                    />
                  `
                : profilePicPlaceholder}

              <h2 id="my-name">
                ${store.user.first_name} ${store.user.last_name}
              </h2>
              <button
                id="logout"
                class="btn-primary"
                onclick="navigate('/logout')"
              >
                Log Out
              </button>
              <div id="follow-info">
                <c-modal id="modal"></c-modal>
                <h3 id="my-followers-count" @click=${this.showFollow}>
                  ${store.user.followers || '-'} Followers
                </h3>
                <h3 id="my-following-count" @click=${this.showFollow}>
                  ${store.user.following || '-'} Following
                </h3>
              </div>
            </div>

            <nav>
              <ul>
                <li ?active=${this.tab === 'home'} onclick="navigate('/home')">
                  Home
                </li>
                <li
                  ?active=${this.tab === 'profile'}
                  onclick="navigate('/profile')"
                >
                  Your Profile
                </li>
                <li
                  ?active=${this.tab === 'find-users'}
                  onclick="navigate('/find-users')"
                >
                  Find Users
                </li>
                <li
                  ?active=${this.tab === 'settings'}
                  onclick="navigate('/settings')"
                >
                  Settings
                </li>
              </ul>
            </nav>

            <div id="duration-info">
              <h2>You've been online for</h2>
              <p>${moment(+localStorage.login_time).fromNow(true)}</p>
              ${wellbeingSvg}
            </div>
          </div>
        </div>
      </header>
      <main>${this.renderMain()}</main>
      <aside>
        <div id="aside-content">
          <c-notifications></c-notifications>
          <c-footer></c-footer>
        </div>
      </aside>
    `
  }

  renderMain() {
    let code = html``

    switch (this.tab) {
      case 'home':
        code = html`<c-feed></c-feed>`
        break

      case 'profile':
      case 'user':
        code = html`<c-profile></c-profile>`
        break

      case 'find-users':
        code = html`<c-find-users></c-find-users>`
        break

      case 'settings':
        code = html`<c-settings></c-settings>`
        break

      default:
        break
    }
    return code
  }
}
