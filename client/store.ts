import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import router from "./router";

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    replies: [],
    freet: {},
    reply: {},
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter
        ? `/api/users/${state.filter}/freets`
        : "/api/freets";
      const res = await fetch(url).then(async (r) => r.json());
      state.freets = res;
    },
    updateReplies(state, replies) {
      /**
       * Update the stored replies to the provided replies.
       * @param replies - Replies to store
       */
      state.replies = replies;
    },
    async refreshReplies(state, payload) {
      /**
       * Request the server for the currently available replies.
       */
      const url = `/api/replies/${payload.parent}/${payload.id}`;
      const res = await fetch(url).then(async (r) => r.json());
      state.replies = res;
    },
    updateFreet(state, freet) {
      state.freet = freet;
    },
    async refreshFreet(state, freetId) {
      const url = `/api/freets/${freetId}`;
      const res = await fetch(url);
      const json = await res.json();
      if (res.status === 200) state.freet = json;
      if (res.status === 404) router.push("/notFound");
    },
    async refreshReply(state, replyId) {
      const url = `/api/replies/${replyId}`;
      const res = await fetch(url);
      const json = await res.json();
      if (res.status === 200) state.reply = json;
      if (res.status === 404) router.push("/notFound");
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()],
});

export default store;
