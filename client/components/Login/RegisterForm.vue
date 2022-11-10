<!-- Form for registering an account (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "RegisterForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/users",
      method: "POST",
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
        {
          id: "password",
          label: "Password",
          value: "",
          type: "password",
          class:
            "input input-bordered input-primary w-full max-w-xs bg-white js-password",
        },
      ],
      title: "Create account",
      callback: () => {
        const message = "Successfully created an account!";
        this.$router.push({ name: "Home" });
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>
