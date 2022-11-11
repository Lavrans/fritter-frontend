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
      submitId: "freetForm",
      submitClass: "justify-end btn-primary h-full",
      fields: [
        {
          id: "content",
          label: "Content",
          value: "",
          class: "textarea-bordered textarea textarea-success w-full",
        },
      ],
      title: "Create Community Freet",
      refreshFreets: true,
      callback: () => {
        this.$store.commit("refreshCommunityFeed");
        const message = "Successfully created a freet!";
        this.$store.commit("alert", { message, status: "success" });
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>
