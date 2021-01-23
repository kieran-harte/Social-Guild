import axios from 'axios'
import { customElement, html, LitEl } from '../../components/_LitEl/LitEl'
import store from '../../js/store/store'
import './v-logout.scss'

@customElement('v-logout')
class View extends LitEl {
  constructor() {
    super()

    if (!localStorage.logged_in) {
      navigate('/')
      return
    }

    store.user = {}
    localStorage.clear('logged_in')

    axios
      .get('/api/v1/auth/logout')
      .then((res) => {
        notif('Log out successful.')
      })
      .catch((err) => {
        notif('Could not log out.', 'error')
      })
      .then(() => {
        navigate('/')
      })
  }

  render() {
    return html`Logging out...`
  }
}
