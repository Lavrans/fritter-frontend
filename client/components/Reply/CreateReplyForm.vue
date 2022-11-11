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
      submitId: "freetForm",
      submitClass: "justify-end btn-primary",
      fields: [
        {
          id: "content",
          value: "",
          class: "textarea-bordered textarea textarea-success w-full",
        },
      ],
      title: "Create a reply",
      refreshReplies: true,
      callback: () => {
        const message = "Successfully created a reply!";
        this.$store.commit("refreshReplies", {
          id: this.id,
          parent: this.parent,
        });
        this.$store.commit("alert", { message, status: "success" });
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>
