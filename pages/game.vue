<template>
  <div class="container">
    <h2>Game Services</h2>
    <VipGameServicesForm />
    <VipGameOrderTopUpForm />
    <VipGameOrderJokiForm />
    <VipGameCheckStatusForm />
    <VipGameNicknameForm />
    <!-- Webhook endpoint biasanya untuk server, bukan frontend, jadi tidak dibuat form -->
    <NuxtLink to="/" class="btn">Kembali</NuxtLink>
  </div>
</template>

<script setup>
import VipGameServicesForm from '~/components/vipayment/VipGameServicesForm.vue'
import VipGameOrderTopUpForm from '~/components/vipayment/VipGameOrderTopUpForm.vue'
import VipGameOrderJokiForm from '~/components/vipayment/VipGameOrderJokiForm.vue'
import VipGameCheckStatusForm from '~/components/vipayment/VipGameCheckStatusForm.vue'
import VipGameNicknameForm from '~/components/vipayment/VipGameNicknameForm.vue'
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
