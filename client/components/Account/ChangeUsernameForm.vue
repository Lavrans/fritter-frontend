<!-- Form for changing username (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "ChangeUsernameForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/users",
      method: "PATCH",
      hasBody: true,
      setUsername: true,
      submitClass: "justify-end btn-primary",
      fields: [
        {
          id: "username",
          label: "Username",
          value: "",
          class: "input input-bordered input-primary w-full max-w-xs bg-white",
        },
      ],
      title: "Change username",
      callback: () => {
        const message = "Successfully changed username!";
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>
