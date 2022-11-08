<template>
  <article class="community">
    <header>
      <h3>Community</h3>
      <router-link
        :to="{ name: 'Community', params: { communityName: community.name } }"
        class="link"
      >
        <h3 class="Name">{{ community.name }}</h3>
      </router-link>
      <div v-if="$store.state.username === community.owner" class="actions">
        <button @click="deleteCommunity">🗑️Delete</button>
      </div>
    </header>
    <router-link :to="{ name: 'User', params: { username: community.owner } }">
      <h4 class="owner">@{{ community.owner }}</h4>
    </router-link>
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
  name: "CommunityComponent",
  props: {
    community: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      alerts: {},
    };
  },
  methods: {
    deleteCommunity() {
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted community!",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    async request(params) {
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      try {
        const r = await fetch(
          `/api/communities/${this.community._id}`,
          options
        );
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit("refreshCommunities");

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
.community {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}
.link {
  text-decoration: none;
}
</style>
