<!-- Form for signing in (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "LoginForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/users/session",
      method: "POST",
      hasBody: true,
      setUsername: true,
      submitClass: "btn-primary",
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
      title: "Sign in",
      callback: () => {
        this.$router.push({ name: "Home" });
        this.$store.commit("alert", {
          message: "You are now signed in!",
          status: "success",
        });
      },
    };
  },
};
</script>
