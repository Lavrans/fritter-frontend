<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "CreateCommunityForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/communities",
      method: "POST",
      hasBody: true,
      fields: [{ id: "name", label: "Name", value: "" }],
      title: "Create a Community",
      refreshFreets: true,
      callback: () => {
        this.$store.commit("refreshCommunities");
        const message = "Successfully created a Community!";
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>
