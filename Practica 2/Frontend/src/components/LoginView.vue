<template>
  <section class="card">
    <h2>Login</h2>
    <form @submit.prevent="submit">
      <label>Email</label>
      <input v-model="form.email" type="email" required />

      <label>Contraseña</label>
      <input v-model="form.password" type="password" required minlength="8" />

      <button type="submit">Entrar</button>
    </form>

    <p v-if="message" class="ok">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { loginUser } from "../services/api";

const router = useRouter();
const form = reactive({ email: "", password: "" });
const message = ref("");
const error = ref("");

async function submit() {
  message.value = "";
  error.value = "";
  try {
    const response = await loginUser(form);
    message.value = response.message;
    await router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.detail ?? "Login failed";
  }
}
</script>

