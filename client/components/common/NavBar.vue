<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav class="navbar bg-primary text-primary-content">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </label>
        <ul
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li><router-link to="/"> Home </router-link></li>
          <li><router-link to="/communities"> Communities </router-link></li>
          <li v-if="$store.state.username">
            <router-link to="/account"> Account </router-link>
          </li>
          <li v-else><router-link to="/login"> Login </router-link></li>
        </ul>
      </div>
      <img src="../../public/logo.svg" />
      <h1 class="title">Fritter</h1>
    </div>
    <div class="navbar-end hidden lg:flex">
      <ul class="menu menu-horizontal p-0">
        <li><router-link to="/"> Home </router-link></li>
        <li><router-link to="/communities"> Communities </router-link></li>
        <li v-if="$store.state.username">
          <router-link to="/account"> Account </router-link>
        </li>
        <li v-else><router-link to="/login"> Login </router-link></li>
      </ul>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
.title {
  font-size: 32px;
  margin: 0 5px;
}

img {
  height: 32px;
}

.left {
  display: flex;
  align-items: center;
}

.right {
  font-size: 20px;
  display: grid;
  gap: 16px;
  grid-auto-flow: column;
  align-items: center;
}

.right a {
  margin-left: 5px;
}

.alerts {
  width: 25%;
}
</style>
