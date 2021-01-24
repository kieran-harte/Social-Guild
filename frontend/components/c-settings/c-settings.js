import store from '../../js/store/store'
import { customElement, html, LitEl, query } from '../_LitEl/LitEl'
import './c-settings.scss'

require('../c-modal/c-modal')
require('../c-edit-info/c-edit-info')
require('../c-change-password/c-change-password')

@customElement('c-settings')
class Component extends LitEl {
  @query('#modal') modal

  editInfo() {
    this.modal.slot = html`
      <c-edit-info @edit-modal-close=${this.modal.toggle}></c-edit-info>
    `
    this.modal.toggle()
  }

  changePassword() {
    this.modal.slot = html`
      <c-change-password
        @edit-modal-close=${this.modal.toggle}
      ></c-change-password>
    `
    this.modal.toggle()
  }

  render() {
    return html`
      <c-modal id="modal"></c-modal>

      <h1>Settings</h1>

      <ul id="basic-info">
        <li>
          <label for="">First name</label>
          <p>${store.user.first_name}</p>
        </li>
        <li>
          <label for="">Last Name</label>
          <p>${store.user.last_name}</p>
        </li>
        <li>
          <label for="">Email</label>
          <p>${store.user.email}</p>
        </li>
      </ul>
      <button class="btn-primary" id="btn-edit" @click=${this.editInfo}>
        Edit Info
      </button>

      <ul id="change-info">
        <li>
          <label for="">Password</label>
          <button
            class="btn-primary"
            id="btn-passwd"
            @click=${this.changePassword}
          >
            Change Password
          </button>
        </li>
        <li>
          <label for="">Profile Picture</label>
          <button class="btn-primary" id="btn-pp">
            Change Profile Picture
          </button>
        </li>
      </ul>
    `
  }
}
