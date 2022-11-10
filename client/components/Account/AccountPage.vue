<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main class="flex flex-wrap justify-around">
    <section>
      <header>
        <h2 class="text-xl font-semibold my-12">
          Account settings for @{{ $store.state.username }}
        </h2>
      </header>
      <ChangeUsernameForm class="card shadow-lg w-96 my-8" />
      <ChangePasswordForm class="card shadow-lg w-96 my-8" />
    </section>
    <section>
      <header>
        <h2 class="text-xl font-semibold my-12">Account management</h2>
      </header>
      <LogoutForm class="card shadow-lg w-96 my-12" />
      <DeleteAccountForm class="card shadow-lg w-96 my-12" />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from "@/components/Account/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Account/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/Account/DeleteAccountForm.vue";
import LogoutForm from "@/components/Account/LogoutForm.vue";

export default {
  name: "AccountPage",
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
  },
};
</script>
