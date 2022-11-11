<template>
  <article class="card shadow-lg w-full bg-base-200">
    <div class="card-body">
      <h1 class="card-title text-xl font-semibold">User</h1>
      <h1 class="card-title text-xl font-semibold">@{{ user.username }}</h1>
      <div v-if="$store.state.username !== user.username">
        <p v-if="user.friends" class="text-success">You are friends</p>
        <p v-else-if="user.following" class="text-info">You are following</p>
        <p v-else class="text-info">You are not following</p>
      </div>
      <div v-else><p class="text-info">This is you</p></div>
      <div
        v-if="$store.state.username !== user.username"
        class="card-actions justify-end"
      >
        <button @click="unfollow" v-if="user.following" class="btn btn-accent">
          Unfollow
        </button>
        <button @click="follow" v-else class="btn btn-primary">Follow</button>
      </div>
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </div>
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
  mounted() {},
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
        this.$store.commit("alert", { message: e, status: "error" });
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped></style>
