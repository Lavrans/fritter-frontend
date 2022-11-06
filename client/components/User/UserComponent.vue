<template>
  <article class="user">
    <h1>{{ user.username }}</h1>
    <p v-if="user.friends">You are friends</p>
    <p v-else-if="user.following">You are following</p>
    <p v-else>You are not following</p>
    <button @click="unfollow" v-if="user.following">Unfollow</button>
    <button @click="follow" v-else>Follow</button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: "UserComponent",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    console.log(this.user);
  },
  data() {
    return {
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    unfollow() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully unfollowed",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    follow() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: "POST",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully followed",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };

      try {
        const r = await fetch(`/api/followers/${this.user.username}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit("refreshUser", this.user.username);

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
.user {
  border: 1px solid #111;
  padding: 20px;
  display: block;
  width: 100%;
}
</style>
