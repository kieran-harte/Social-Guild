import { html } from 'lit-element'
import { unsafeHTML } from 'lit-html/directives/unsafe-html'

export default class Router {
  constructor(_this, routes) {
    this.updatePage = this.updatePage.bind(_this)
    this.navigate = this.navigate.bind(this)
    window.navigate = this.navigate
    this.routes = routes

    this.previousContent = ''
  }

  async navigate(pageUrl, dontPushState = false, scrollPosition = 0) {
    window.showLoading()

    // check route exists
    const { pathname } = new URL(pageUrl, window.location)
    if (!Object.prototype.hasOwnProperty.call(this.routes, pathname)) {
      console.log(`Route ${pathname} not defined`)
      window.notif(`Page not found`)
      window.hideLoading()
      return
    }

    // Check Authorized
    if (this.routes[pathname].protected) {
      if (!localStorage.auth_token) {
        window.notif('Please sign in')
        window.redirect = pageUrl
        window.navigate('/signin')
        return
      }
    }

    // Don't push state if reloading
    if (pageUrl === window.currentUrl) {
      dontPushState = true
    }

    // Set global url prop
    window.currentUrl = pageUrl

    // Push new page to history, unless navigating back
    if (!dontPushState) {
      // keep track of pages to handle going back nicely
      window.history.stack = window.history.stack || []
      window.history.stack.push(pageUrl) // use the url WITH query params

      // Pointer to current page in stack
      window.history.stackPointer = window.history.stack.length

      // TODO vanilla scrollTop
      // window.history.pushState(
      //   { scrollPos: $(window).scrollTop() },
      //   '',
      //   pageUrl
      // )
      window.history.pushState({ scrollPos: 0 }, '', pageUrl)
    }

    // Handle query parameters - sets window.params to object of url parameters
    const split = pageUrl.split('?')
    pageUrl = split[0]
    window.params = {}
    if (split[1]) {
      const pStr = split[1]
      const pArray = pStr.split('&')
      pArray.forEach((param) => {
        const pSplit = param.split('=')
        window.params[pSplit[0]] = decodeURI(pSplit[1])
      })
    }

    if (Object.prototype.hasOwnProperty.call(this.routes[pageUrl], 'params'))
      window.params = { ...window.params, ...this.routes[pageUrl].params }

    // Import the component so it is defined - should be defined in global scope
    await this.loadComponent(pageUrl)

    // TODO vanilla
    // $(window).scrollTop(scrollPosition)
    window.hideLoading()
  }

  async loadComponent(url) {
    // const data = await this.routes[url].import
    try {
      if (!customElements.get(this.routes[url].component)) {
        await this.routes[url].import
      }
    } catch (error) {
      console.log(error)
    }

    this.updatePage(this.routes[url].component)
  }

  updatePage(data) {
    this.viewContent = html``
    this.requestUpdate().then(() => {
      this.viewContent = unsafeHTML(`<${data}></${data}>`)
    })
  }
}

// Handle going back in browser
window.onpopstate = (e) => {
  if (e.state) {
    e.preventDefault()
  }

  window.history.stackPointer--

  window.navigate(
    window.location.pathname + window.location.search,
    true,
    (e.state || 0).scrollPos || 0
  )

  /* TODO use window.history.stack so that when navigating back from code,
		if the last page is not on this website (stack size == 0), go to home page
		navigating back with the back button should still allow going back to a different website
		*/
}

// When a toUrl is passed, it will call history.back() if you've come from that url, else it will navigate() to that url
window.back = (toUrl) => {
  /*
	toUrl		stack		!=-2
		0				0							'/'
		0				1							back
		1				0							toUrl
		1				1				0			back
		1				1				1			toUrl
	*/

  // Go back if there is a stack and no toUrl, or if the toUrl is the same as the previous url
  if (
    Object.prototype.hasOwnProperty.call(window.history, 'stack') &&
    (!toUrl || toUrl === window.history.stack[window.history.stack.length - 2])
  ) {
    window.history.back()
    return
  }

  // Navigate to toUrl if there is one and no stack, or the previous page is not the same as the toUrl
  if (
    toUrl &&
    (!Object.prototype.hasOwnProperty.call(window.history, 'stack') ||
      toUrl !== window.history.stack[window.history.stack.length - 2])
  ) {
    window.navigate(toUrl)
    return
  }

  // No stack or toUrl, so navigate to home page
  window.navigate('/home')
}

// Shows loading overlay
window.showLoading = () => {
  // const el = $('loading-overlay')[0]
  const app = document.querySelector('app-root')

  const lo = document.querySelector('#loadingOverlay')
  if (!lo) return
  lo.setAttribute('visible', 'true')

  app.classList.add('fadeOut')
  window._navStartTime = Date.now()
}

// Hides loading overlay
window.hideLoading = () => {
  const animTime = 0
  setTimeout(() => {
    const app = document.querySelector('app-root')
    const lo = document.querySelector('#loadingOverlay')
    if (!lo) return
    lo.removeAttribute('visible')

    app.classList.remove('fadeOut')
  }, animTime - (Date.now() - window._navStartTime))
}
