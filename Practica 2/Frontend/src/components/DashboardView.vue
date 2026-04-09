<template>
  <section class="card">
    <h2>Login Exitoso</h2>
    <div class="actions">
      <button @click="loadProfile">Cargar perfil</button>
      <button @click="callClientRoute">Ruta Cliente/Admin</button>
      <button @click="callAdminRoute">Ruta Admin</button>
      <button @click="logout">Logout</button>
    </div>

    <pre v-if="result">{{ result }}</pre>
    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { ref } from "vue";

import { getAdminRoute, getClientRoute, getCurrentUser, logoutUser } from "../services/api";

const result = ref("");
const error = ref("");

async function runRequest(requestFn) {
  result.value = "";
  error.value = "";
  try {
    const data = await requestFn();
    result.value = JSON.stringify(data, null, 2);
  } catch (err) {
    error.value = err.response?.data?.detail ?? "Request failed";
  }
}

async function loadProfile() {
  await runRequest(getCurrentUser);
}

async function callClientRoute() {
  await runRequest(getClientRoute);
}

async function callAdminRoute() {
  await runRequest(getAdminRoute);
}

async function logout() {
  await runRequest(logoutUser);
}
</script>

