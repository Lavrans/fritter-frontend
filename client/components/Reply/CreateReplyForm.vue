<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "CreateReplyForm",
  mixins: [BlockForm],
  props: {
    url: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    parent: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      method: "POST",
      hasBody: true,
      fields: [{ id: "content", label: "Content", value: "" }],
      title: "Create a reply",
      refreshReplies: true,
      callback: () => {
        const message = "Successfully created a reply!";
        this.$store.commit("refreshReplies", {
          id: this.id,
          parent: this.parent,
        });
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>
