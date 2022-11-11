<!-- Default page that also displays freets -->

<template>
  <main>
    <header>
      <UserComponent :user="$store.state.user" class="mt-8" />
    </header>

    <h2 class="text-xl my-12 font-semibold">
      @{{ $store.state.user.username }}'s Freets
    </h2>
    <section v-if="$store.state.freets.length">
      <FreetComponent
        v-for="freet in $store.state.freets"
        :key="freet.id"
        :freet="freet"
      />
    </section>
    <section v-else><h2>No Freets found.</h2></section>
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

<style scoped></style>
