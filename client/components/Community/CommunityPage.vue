<!-- Default page that also displays freets -->

<template>
  <main>
    <header>
      <CommunityComponent :community="$store.state.community" />
      <CreateCommunityFreetForm :community="$store.state.community._id" />
      <div v-if="$store.state.username === $store.state.community.owner">
        <label for="newOwnerUserName">Change Owner: </label>
        <input
          type="text"
          id="newOwnerUserName"
          name="newOwnerUserName"
          :value="newOwnerUserName"
          @input="(event) => (newOwnerUserName = event.target.value)"
        />
        <button @click="changeOwner">Change Owner</button>
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
    </header>

    <section v-if="$store.state.communityFeed.length">
      <FreetComponent
        v-for="freet in $store.state.communityFeed"
        :key="freet.id"
        :freet="freet"
      />
    </section>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import CommunityComponent from "@/components/Community/CommunityComponent.vue";
import CreateCommunityFreetForm from "@/components/Community/CreateCommunityFreetForm.vue";

export default {
  name: "CommunityPage",
  components: { FreetComponent, CommunityComponent, CreateCommunityFreetForm },
  data() {
    return {
      newOwnerUserName: "",
      alerts: {},
    };
  },
  async created() {
    await this.$store.commit(
      "refreshCommunity",
      this.$route.params.communityName
    );
    await this.$store.commit("refreshCommunityFeed");
  },
  methods: {
    changeOwner() {
      const params = {
        method: "PUT",
        url: `/api/communities/${this.$store.state.community._id}/${this.newOwnerUserName}`,
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully changed owner!",
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

        this.$store.commit(
          "refreshCommunity",
          this.$store.state.community.name
        );

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
section {
  display: flex;
  flex-direction: column;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
.alerts {
  display: block;
  position: static;
  transform: translate(0, 0);
}
</style>
