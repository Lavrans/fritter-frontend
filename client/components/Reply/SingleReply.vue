<template>
  <main>
    <ReplyComponent
      style="margin-top: 5px"
      :reply="$store.state.reply"
      :singleView="true"
    />

    <h3>Replies</h3>
    <CreateReplyForm
      :url="'/api/replies/reply/' + $store.state.reply._id"
      :id="$store.state.reply._id"
      :parent="'reply'"
    />
    <div class="replies">
      <ReplyComponent
        v-for="reply in $store.state.replies"
        :key="reply._id"
        :reply="reply"
        :parent="'reply'"
      />
    </div>
  </main>
</template>
<script>
import ReplyComponent from "@/components/Reply/ReplyComponent.vue";
import CreateReplyForm from "@/components/Reply/CreateReplyForm.vue";
export default {
  name: "SingleReply",
  components: { ReplyComponent, CreateReplyForm },
  props: {
    // Data from the stored reply
  },
  data() {
    return {};
  },
  async beforeCreate() {
    await this.$store.commit("refreshReply", this.$route.params.id);
    await this.$store.commit("refreshReplies", {
      id: this.$route.params.id,
      parent: "reply",
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
