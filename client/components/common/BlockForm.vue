<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit" class="card">
    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>
      <article v-if="fields.length">
        <div
          v-for="field in fields"
          :key="field.id"
          class="form-control w-full max-w-xs"
        >
          <label class="label">
            <span v-if="field.label" class="label-text">
              {{ field.label }}:
            </span></label
          >
          <textarea
            v-if="field.id === 'content'"
            placeholder="Content..."
            :name="field.id"
            :value="field.value"
            :class="field.class ? field.class : ''"
            @input="field.value = $event.target.value"
          />
          <input
            v-else
            :type="field.type !== undefined ? field.type : 'text'"
            :ref="field.id"
            :name="field.id"
            :value="field.value"
            :class="field.class ? field.class : ''"
            @input="field.value = $event.target.value"
          />
        </div>
      </article>
      <article v-else>
        <p>{{ content }}</p>
      </article>
      <label
        :class="'btn btn-sm w-36 mx-auto ' + submitClass"
        :for="submitId"
        @click="submit"
      >
        {{ title }}
      </label>
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </div>
  </form>
</template>

<script>
export default {
  name: "BlockForm",
  props: {
    community: {
      type: String,
      default: null,
    },
  },
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: "", // Url to submit form to
      method: "GET", // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshFreets: false, // Whether or not stored freets should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
      submitId: null,
      submitId: "",
    };
  },
  methods: {
    async submit() {
      /**
       * Submits a form with the specified options from data().
       */
      const options = {
        method: this.method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };
      if (this.hasBody) {
        const object = Object.fromEntries(
          this.fields.map((field) => {
            let { id, value } = field;
            field.value = "";
            if (id === "friendsOnly") {
              value = this.$refs.friendsOnly[0].checked;
            }
            return [id, value];
          })
        );
        if (this.community !== null) {
          object.community = this.community;
        }
        options.body = JSON.stringify(object);
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : { user: null };
          this.$store.commit(
            "setUsername",
            res.user ? res.user.username : null
          );
          this.$store.commit("setFeedId", res.user ? res.user.feed : null);
        }

        if (this.refreshFreets) {
          this.$store.commit("refreshFreets");
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$store.commit("alert", { message: e, status: "error" });
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped></style>
