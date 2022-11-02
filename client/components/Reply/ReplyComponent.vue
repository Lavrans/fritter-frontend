<!-- Reusable component representing a single reply and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="reply">
    <header>
      <router-link
        v-if="singleView"
        :to="`/${reply.parentType.toLowerCase()}/${reply.parent}`"
        ><button>Back</button></router-link
      >
      <h3 v-if="singleView">Reply</h3>
      <h3 class="author">@{{ reply.author }}</h3>
      <div v-if="$store.state.username === reply.author" class="actions">
        <button v-if="editing" @click="submitEdit">✅ Save changes</button>
        <button v-if="editing" @click="stopEditing">🚫 Discard changes</button>
        <button v-if="!editing" @click="startEditing">✏️ Edit</button>
        <button @click="deleteReply">🗑️ Delete</button>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p v-else class="content">
      {{ reply.content }}
    </p>
    <p class="info">
      Posted at {{ reply.dateModified }}
      <i v-if="reply.edited">(edited)</i>
    </p>
    <router-link :to="{ name: 'Reply', params: { id: reply._id } }"
      ><button v-if="!singleView">Replies</button></router-link
    >
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: "ReplyComponent",
  props: {
    // Data from the stored reply
    reply: {
      type: Object,
      required: true,
    },
    parent: {
      type: String,
      required: true,
    },
    singleView: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        this.$store.commit("refreshReply", toParams.id);
        this.$store.commit("refreshReplies", {
          id: toParams.id,
          parent: "reply",
        });
      }
    );
  },
  data() {
    return {
      editing: false, // Whether or not this reply is in edit mode
      draft: this.reply.content, // Potentially-new content for this reply
      alerts: {}, // Displays success/error messages encountered during reply modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this reply.
       */
      this.editing = true; // Keeps track of if a reply is being edited
      this.draft = this.reply.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this reply.
       */
      this.editing = false;
      this.draft = this.reply.content;
    },
    deleteReply() {
      /**
       * Deletes this reply.
       */
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted reply!",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates reply to have the submitted draft content.
       */
      if (this.reply.content === this.draft) {
        const error =
          "Error: Edited reply content should be different than current reply content.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: "PUT",
        message: "Successfully edited reply!",
        body: JSON.stringify({ content: this.draft }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the reply's endpoint
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
        const r = await fetch(`/api/replies/${this.reply._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        if (this.singleView) {
          this.$store.commit("refreshReply", this.reply._id);
        } else {
          this.$store.commit("refreshReplies", {
            id: this.reply.parent,
            parent: this.reply.parentType.toLowerCase(),
          });
        }

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
.reply {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}
</style>
