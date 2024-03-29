// DO NOT EDIT THIS FILE - IT IS GENERATED FROM routes.json
export default {
  "/": {
    import: import("../views/v-landing/v-landing.js"),
    component: "v-landing",
    title: "",
    protected: false,
  },
  "/about": {
    title: "About",
    import: import("../views/v-about/v-about.js"),
    component: "v-about",
    protected: false,
  },
  "/signup": {
    title: "Sign Up",
    import: import("../views/v-signup/v-signup.js"),
    component: "v-signup",
    protected: false,
  },
  "/login": {
    title: "Log In",
    import: import("../views/v-login/v-login.js"),
    component: "v-login",
    protected: false,
  },
  "/home": {
    title: "Home",
    import: import("../views/v-home/v-home.js"),
    component: "v-home",
    protected: true,
  },
  "/profile": {
    title: "Your profile",
    import: import("../views/v-home/v-home.js"),
    component: "v-home",
    protected: true,
    params: { page: "profile" },
  },
  "/user": {
    title: "User Profile",
    import: import("../views/v-home/v-home.js"),
    component: "v-home",
    protected: true,
    params: { page: "user" },
  },
  "/find-users": {
    title: "Find Users",
    import: import("../views/v-home/v-home.js"),
    component: "v-home",
    protected: true,
    params: { page: "find-users" },
  },
  "/settings": {
    title: "Settings",
    import: import("../views/v-home/v-home.js"),
    component: "v-home",
    protected: true,
    params: { page: "settings" },
  },
  "/logout": {
    import: import("../views/v-logout/v-logout.js"),
    component: "v-logout",
    title: "Log Out",
  },
};
