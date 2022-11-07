import Vue from "vue";
import VueRouter from "vue-router";
import FreetsPage from "./components/Freet/FreetsPage.vue";
import FeedPage from "./components/Feed/FeedPage.vue";
import UserPage from "./components/User/UserPage.vue";
import SingleFreet from "./components/Freet/SingleFreet.vue";
import SingleReply from "./components/Reply/SingleReply.vue";
import AccountPage from "./components/Account/AccountPage.vue";
import LoginPage from "./components/Login/LoginPage.vue";
import NotFound from "./NotFound.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "Home", component: FreetsPage },
  { path: "/feed", name: "Feed", component: FeedPage },
  { path: "/freet/:id", name: "Freet", component: SingleFreet },
  { path: "/reply/:id", name: "Reply", component: SingleReply },
  { path: "/user/:username", name: "User", component: UserPage },
  { path: "/account", name: "Account", component: AccountPage },
  { path: "/login", name: "Login", component: LoginPage },
  { path: "*", name: "Not Found", component: NotFound },
];

const router = new VueRouter({ routes });

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === "Login" && router.app.$store.state.username) {
      next({ name: "Account" }); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === "Account" && !router.app.$store.state.username) {
      next({ name: "Login" }); // Go to Login page if user navigates to Account and are not signed in
      return;
    }

    if (to.name === "Home") {
      router.app.$store.commit("updateFilter", "");
    }
  }

  next();
});

export default router;
