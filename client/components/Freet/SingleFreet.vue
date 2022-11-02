<template>
  <main>
    <FreetComponent
      style="margin-top: 5px"
      :freet="$store.state.freet"
      :singleView="true"
    />

    <h3>Replies</h3>
    <CreateReplyForm
      :url="'/api/replies/freet/' + $store.state.freet._id"
      :id="$store.state.freet._id"
      :parent="'freet'"
    />
    <div class="replies">
      <ReplyComponent
        v-for="reply in $store.state.replies"
        :key="reply._id"
        :reply="reply"
        :parent="'freet'"
      />
    </div>
  </main>
</template>
<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import ReplyComponent from "@/components/Reply/ReplyComponent.vue";
import CreateReplyForm from "@/components/Reply/CreateReplyForm.vue";
export default {
  name: "SingleFreet",
  components: { FreetComponent, ReplyComponent, CreateReplyForm },
  props: {
    // Data from the stored freet
  },
  data() {
    return {};
  },
  async beforeCreate() {
    await this.$store.commit("refreshFreet", this.$route.params.id);
    await this.$store.commit("refreshReplies", {
      id: this.$route.params.id,
      parent: "freet",
    });
  },
  methods: {},
};
</script>

<style scoped>
.replies {
  display: flex;
  gap: 5px;
  flex-direction: column;
}
</style>
