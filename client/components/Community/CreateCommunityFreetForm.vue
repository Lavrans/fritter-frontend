<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "CreateCommunityFreetForm",
  mixins: [BlockForm],
  props: {
    community: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      url: "/api/freets",
      method: "POST",
      hasBody: true,
      fields: [{ id: "content", label: "Content", value: "" }],
      title: "Create a freet",
      refreshFreets: true,
      callback: () => {
        this.$store.commit("refreshCommunityFeed");
        const message = "Successfully created a freet!";
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>
