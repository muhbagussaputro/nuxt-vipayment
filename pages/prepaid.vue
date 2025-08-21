<template>
  <div class="container">
    <h2>Prepaid Services</h2>
    <PrepaidServicesForm />
    <PrepaidOrderForm />
    <PrepaidCheckForm />
    <!-- Webhook endpoint biasanya untuk server, bukan frontend, jadi tidak dibuat form -->
    <NuxtLink to="/" class="btn">Kembali</NuxtLink>
  </div>
</template>

<script setup>
import PrepaidServicesForm from '~/components/prepaid/PrepaidServicesForm.vue'
import PrepaidOrderForm from '~/components/prepaid/PrepaidOrderForm.vue'
import PrepaidCheckForm from '~/components/prepaid/PrepaidCheckForm.vue'
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 40px auto;
  text-align: center;
}
.btn {
  margin-top: 32px;
  display: inline-block;
  padding: 12px 32px;
  background: #1e88e5;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
}
</style>
