<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main class="flex flex-wrap justify-around">
    <section>
      <RegisterForm class="card shadow-lg w-96 my-8" />
    </section>
    <section>
      <LoginForm class="card shadow-lg w-96 my-8" />
    </section>
  </main>
</template>

<script>
import RegisterForm from "@/components/Login/RegisterForm.vue";
import LoginForm from "@/components/Login/LoginForm.vue";

export default {
  name: "LoginPage",
  components: {
    RegisterForm,
    LoginForm,
  },
};
</script>
