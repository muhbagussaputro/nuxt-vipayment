<template>
  <div class="container">
    <h2>Prepaid Services</h2>
    <VipPrepaidServicesForm />
    <VipPrepaidOrderForm />
    <VipPrepaidCheckForm />
    <!-- Webhook endpoint biasanya untuk server, bukan frontend, jadi tidak dibuat form -->
    <NuxtLink to="/" class="btn">Kembali</NuxtLink>
  </div>
</template>

<script setup>
import VipPrepaidServicesForm from '~/components/vipayment/VipPrepaidServicesForm.vue'
import VipPrepaidOrderForm from '~/components/vipayment/VipPrepaidOrderForm.vue'
import VipPrepaidCheckForm from '~/components/vipayment/VipPrepaidCheckForm.vue'
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
