<!-- Default page that also displays freets -->

<template>
  <main>
    <section>
      <header>
        <h2>Communities</h2>
      </header>
      <CreateCommunityForm />
    </section>
    <section>
      <section v-if="$store.state.communities.length">
        <CommunityComponent
          v-for="community in $store.state.communities"
          :key="community._id"
          :community="community"
        />
      </section>
      <article v-else>
        <h3>No communities found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import CommunityComponent from "@/components/Community/CommunityComponent.vue";
import CreateCommunityForm from "@/components/Community/CreateCommunityForm.vue";

export default {
  name: "CommunitiesPage",
  components: { CommunityComponent, CreateCommunityForm },
  mounted() {
    this.$store.commit("refreshCommunities");
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
