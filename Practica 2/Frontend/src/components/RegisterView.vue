<template>
  <section class="card">
    <h2>Register</h2>
    <form @submit.prevent="submit">
      <label>Nombre completo</label>
      <input v-model="form.full_name" required minlength="2" />

      <label>Email</label>
      <input v-model="form.email" type="email" required />

      <label>Password</label>
      <input v-model="form.password" type="password" required minlength="8" />

      <label>Role</label>
      <select v-model="form.role">
        <option value="client">Client</option>
        <option value="admin">Admin</option>
      </select>

      <label>Admin Key (solo si role=admin)</label>
      <input v-model="form.admin_key" />

      <button type="submit">Registrar</button>
    </form>

    <p v-if="message" class="ok">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";

import { registerUser } from "../services/api";

const form = reactive({
  full_name: "",
  email: "",
  password: "",
  role: "client",
  admin_key: "",
});

const message = ref("");
const error = ref("");

async function submit() {
  message.value = "";
  error.value = "";

  const payload = {
    full_name: form.full_name,
    email: form.email,
    password: form.password,
    role: form.role,
    admin_key: form.admin_key || null,
  };


  // credenciales: admin@gmail.com contra: 12345678
    // credenciales: admin2@gmail.com contra: 12345678


  try {
    const response = await registerUser(payload);
    message.value = response.message;
  } catch (err) {
    error.value = err.response?.data?.detail ?? "Register failed";
  }
}
</script>

