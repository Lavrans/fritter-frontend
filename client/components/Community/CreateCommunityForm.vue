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
      submitId: "communityForm",
      submitClass: "justify-end btn-primary w-36",
      fields: [
        {
          id: "name",
          label: "Name",
          value: "",
          class: "textarea-bordered textarea textarea-info w-full",
        },
      ],
      title: "Create Community",
      refreshFreets: true,
      callback: () => {
        this.$store.commit("refreshCommunities");
        const message = "Successfully created a Community!";
        this.$store.commit("alert", { message, status: "success" });
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>
