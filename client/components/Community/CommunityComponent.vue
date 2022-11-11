<template>
  <article class="card shadow-lg w-full p-12 my-6 bg-base-200">
    <header>
      <h3 class="card-title">Community</h3>
      <h3 class="Name">
        Name:
        <router-link
          :to="{ name: 'Community', params: { communityName: community.name } }"
          class="btn-link"
        >
          {{ community.name }}
        </router-link>
      </h3>
    </header>
    <h4 class="owner">
      Owner:
      <router-link
        :to="{ name: 'User', params: { username: community.owner } }"
        class="btn-link"
      >
        @{{ community.owner }}
      </router-link>
    </h4>
    <div class="card-actions justify-end">
      <div v-if="$store.state.username && $store.state.username.length">
        <button
          @click="joinCommunity"
          v-if="!community.isMember"
          class="btn btn-success"
        >
          Join
        </button>
        <button
          @click="leaveCommunity"
          v-if="$store.state.username !== community.owner && community.isMember"
          class="btn btn-accent"
        >
          Leave
        </button>
      </div>
      <label
        v-if="$store.state.username === community.owner"
        :for="'delete-community-modal' + community._id"
        class="btn btn-error"
        >🗑️Delete</label
      >
      <input
        type="checkbox"
        :id="'delete-community-modal' + community._id"
        class="modal-toggle"
      />
      <div class="modal">
        <div class="modal-box relative bg-base-100">
          <p>
            Are you sure you want to delete? This is an irreversible action.
          </p>
          <div class="flex justify-between">
            <label
              :for="'delete-community-modal' + community._id"
              class="btn btn-outline btn-warning"
              >Cancel</label
            >
            <label
              @click="deleteCommunity"
              :for="'delete-community-modal' + community._id"
              class="btn btn-error btn-outline"
            >
              Delete
            </label>
          </div>
        </div>
      </div>
      <!-- <div v-if="$store.state.username === community.owner"> -->
      <!--   <button @click="deleteCommunity">🗑️Delete</button> -->
      <!-- </div> -->
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
