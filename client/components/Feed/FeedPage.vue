<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2 class="text-xl font-semibold">
          @{{ $store.state.username }}'s Feed
        </h2>
      </header>
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
          <CreateFreetForm />
        </div>
      </div>
    </section>
    <section>
      <header></header>
      <div class="tabs flex flex-row mx-auto">
        <router-link to="/" class="tab tab-bordered"> All Freets </router-link>
        <router-link to="/feed" class="tab tab-bordered tab-active">
          Your Feed
        </router-link>
      </div>
      <section v-if="$store.state.feed.length">
        <FreetComponent
          v-for="freet in $store.state.feed"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article v-else>
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";

export default {
  name: "FeedPage",
  components: { FreetComponent, CreateFreetForm },
  created() {
    this.$store.commit("refreshFeed");
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header,
header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
.nav {
  display: flex;
  flex-direction: row;
  gap: 2em;
  margin: auto;
}
</style>
