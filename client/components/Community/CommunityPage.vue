<!-- Default page that also displays freets -->

<template>
  <main>
    <header>
      <CommunityComponent :community="$store.state.community" />
      <label for="freetForm" class="btn fixed bottom-12 right-12 z-10"
        >Create Freet</label
      >
      <input type="checkbox" id="freetForm" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box bg-base-300 relative">
          <label
            for="freetForm"
            class="btn btn-sm btn-circle btn-primary absolute right-2 top-2"
            >✕</label
          >
          <CreateCommunityFreetForm :community="$store.state.community._id" />
        </div>
      </div>
      <label
        for="manage-modal"
        v-if="$store.state.username === $store.state.community.owner"
        class="btn btn-primary"
        >Mange Community</label
      >

      <input type="checkbox" id="manage-modal" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box bg-base-200 relative">
          <label
            for="manage-modal"
            class="btn btn-sm btn-circle absolute right-2 top-2"
            >✕</label
          >
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">Change Community Owner</h2>
              <input
                class="input w-full max-w-xs input-bordered"
                type="text"
                id="newOwnerUserName"
                name="newOwnerUserName"
                :value="newOwnerUserName"
                placeholder="New owner's username"
                @input="(event) => (newOwnerUserName = event.target.value)"
              />
              <div class="card-actions justify-around">
                <label
                  for="manage-modal"
                  class="btn btn-accent"
                  @click="changeOwner"
                  >Change Owner</label
                >
              </div>
            </div>
          </div>
        </div>
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

    <section v-if="$store.state.communityFeed.length && loaded">
      <h2 class="text-xl font-semibold">
        {{ $store.state.community.name }} Freets
      </h2>
      <FreetComponent
        v-for="freet in $store.state.communityFeed"
        :key="freet.id"
        :freet="freet"
      />
    </section>
    <section v-else>
      <h2 class="text-xl font-semibold">
        {{ $store.state.community.name }} Freets
      </h2>
      <h2 class="text-lg font-semibold">No Freets found.</h2>
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
      loaded: false,
    };
  },
  async created() {
    await this.$store.commit(
      "refreshCommunity",
      this.$route.params.communityName
    );
    setTimeout(() => {
      this.$store.commit("refreshCommunityFeed");
      this.loaded = true;
    }, 1000);
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
        let message = "";
        if (
          e == `Error: You are the owner of ${this.$store.state.community.name}`
        ) {
          message = "Username cannot be blank.";
        } else {
          message = e;
        }
        this.$store.commit("alert", { message, status: "error" });
      }
    },
  },
};
</script>

<style scoped></style>
