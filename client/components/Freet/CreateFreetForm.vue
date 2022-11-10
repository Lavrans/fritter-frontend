<!-- Form for creating freets (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "CreateFreetForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/freets",
      method: "POST",
      hasBody: true,
      submitId: "freetForm",
      fields: [
        {
          id: "content",
          value: "",
          class: "textarea-bordered textarea textarea-success w-full",
        },
        {
          id: "friendsOnly",
          label: "Friends Only",
          type: "checkbox",
          class: "checkbox",
        },
      ],
      title: "Create a freet",
      refreshFreets: true,
      callback: () => {
        const message = "Successfully created a freet!";
        this.$store.commit("alert", { message, status: "success" });
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>
