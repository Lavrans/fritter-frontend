<template>
  <article class="community">
    <header>
      <h3>Community</h3>
      <h3 class="Name">
        Name:
        <router-link
          :to="{ name: 'Community', params: { communityName: community.name } }"
          class="link"
        >
          {{ community.name }}
        </router-link>
      </h3>
    </header>
    <h4 class="owner">
      Owner:
      <router-link
        :to="{ name: 'User', params: { username: community.owner } }"
      >
        @{{ community.owner }}
      </router-link>
    </h4>
    <div v-if="$store.state.username.length">
      <button @click="joinCommunity" v-if="!community.isMember">Join</button>
      <button @click="leaveCommunity" v-else>Leave</button>
    </div>
    <div v-if="$store.state.username === community.owner">
      <button @click="deleteCommunity">🗑️Delete</button>
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
        url: `/api/communities/${this.community._id}`,
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted community!",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    joinCommunity() {
      const params = {
        method: "PUT",
        url: `/api/communities/${this.community._id}?action=join`,
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully joined community!",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    leaveCommunity() {
      const params = {
        method: "PUT",
        url: `/api/communities/${this.community._id}?action=leave`,
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully left community!",
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
        const r = await fetch(params.url, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit("refreshCommunities");
        this.$store.commit("refreshCommunity", this.community.name);

        params.callback();
      } catch (e) {
        console.log(this.alerts);
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
