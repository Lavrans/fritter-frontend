<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2 class="text-xl font-semibold">
          Welcome @{{ $store.state.username }}
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
    <section v-else>
      <header>
        <h2 class="text-xl font-semibold">Welcome to Fritter!</h2>
      </header>
      <article>
        <h3 class="text-xl font-semibold">
          <router-link to="/login"> Sign in </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="tabs flex flex-row mx-auto">
          <router-link to="/" class="tab tab-bordered tab-active">
            All Freets
          </router-link>
          <router-link to="/feed" class="tab tab-bordered">
            Your Feed
          </router-link>
        </div>
      </header>
      <section v-if="$store.state.freets.length">
        <FreetComponent
          v-for="freet in $store.state.freets"
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
import GetFreetsForm from "@/components/Freet/GetFreetsForm.vue";

export default {
  name: "FreetPage",
  components: { FreetComponent, GetFreetsForm, CreateFreetForm },
  mounted() {
    this.$store.commit("refreshFreets");
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
