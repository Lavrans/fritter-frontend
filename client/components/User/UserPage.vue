<!-- Default page that also displays freets -->

<template>
  <main>
    <header>
      <UserComponent :user="$store.state.user" />
    </header>

    <section v-if="$store.state.freets.length">
      <FreetComponent
        v-for="freet in $store.state.freets"
        :key="freet.id"
        :freet="freet"
      />
    </section>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import UserComponent from "@/components/User/UserComponent.vue";

export default {
  name: "UserPage",
  components: { FreetComponent, UserComponent },
  created() {
    this.$store.commit("refreshUser", this.$route.params.username);
    this.$store.commit("updateFilter", this.$route.params.username);
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
</style>
