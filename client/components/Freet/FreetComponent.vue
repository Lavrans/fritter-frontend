<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="card bg-base-200 shadow-xl my-4">
    <div class="card-body">
      <header>
        <h3 v-if="singleView" class="card-title">Freet</h3>
        <h2 class="author-link card-title">
          <router-link
            :to="{ name: 'User', params: { username: freet.author } }"
          >
            @{{ freet.author }}
          </router-link>
        </h2>
      </header>
      <textarea
        v-if="editing"
        class="textarea textarea-bordered textarea-success"
        :value="draft"
        @input="draft = $event.target.value"
      />
      <p v-else class="text-lg p-4">
        {{ freet.content }}
      </p>
      <p
        class="badge badge-ghost text-primary-content absolute bottom-2 left-2"
      >
        Posted at {{ freet.dateModified }}
        <i v-if="freet.edited">(edited)</i>
      </p>
      <div class="card-actions justify-end">
        <router-link :to="{ name: 'Freet', params: { id: freet._id } }"
          ><button v-if="!singleView && !editing" class="btn btn-link">
            Replies
          </button></router-link
        >
        <button
          v-if="editing && $store.state.username === freet.author"
          @click="submitEdit"
          class="btn btn-success"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing && $store.state.username === freet.author"
          @click="stopEditing"
          class="btn btn-error"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing && $store.state.username === freet.author"
          @click="startEditing"
          class="btn btn-primary"
        >
          ✏️ Edit
        </button>
        <label
          v-if="$store.state.username === freet.author && !editing"
          for="delete-freet-modal"
          class="btn btn-error"
          >🗑️Delete</label
        >
        <input type="checkbox" id="delete-freet-modal" class="modal-toggle" />
        <div class="modal">
          <div class="modal-box relative bg-base-100">
            <p>
              Are you sure you want to delete? This is an irreversible action.
            </p>
            <div class="flex justify-between">
              <label
                for="delete-freet-modal"
                class="btn btn-outline btn-warning"
                >Cancel</label
              >
              <label
                @click="deleteFreet"
                for="delete-freet-modal"
                class="btn btn-error btn-outline"
              >
                Delete
              </label>
            </div>
          </div>
        </div>
      </div>
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
  </article>
</template>

<script>
export default {
  name: "FreetComponent",
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true,
    },
    singleView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted freet!",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error =
          "Error: Edited freet content should be different than current freet content.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: "PATCH",
        message: "Successfully edited freet!",
        body: JSON.stringify({ content: this.draft }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      this.request(params);
      this.$store.commit("refreshFreet", this.freet._id);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit("refreshFreets");
        this.$store.commit("refreshCommunityFeed");

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
.freet {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}
.author-link {
  text-decoration: none;
}
</style>
