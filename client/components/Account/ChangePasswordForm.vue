<!-- Form for changing password (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "ChangePasswordForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/users",
      method: "PATCH",
      hasBody: true,
      submitClass: "justify-end btn-primary",
      fields: [
        {
          id: "password",
          label: "Password",
          value: "",
          class: "input input-bordered input-primary w-full max-w-xs bg-white",
        },
      ],
      title: "Change password",
      callback: () => {
        const message = "Successfully changed password!";
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>
