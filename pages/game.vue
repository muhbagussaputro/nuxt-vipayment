<template>
  <div class="container">
    <h2>Game Services</h2>
    <GameServicesForm />
    <GameOrderTopUpForm />
    <GameOrderJokiForm />
    <GameCheckStatusForm />
    <GameNicknameForm />
    <!-- Webhook endpoint biasanya untuk server, bukan frontend, jadi tidak dibuat form -->
    <NuxtLink to="/" class="btn">Kembali</NuxtLink>
  </div>
</template>

<script setup>
import GameServicesForm from '~/components/game/GameServicesForm.vue'
import GameOrderTopUpForm from '~/components/game/GameOrderTopUpForm.vue'
import GameOrderJokiForm from '~/components/game/GameOrderJokiForm.vue'
import GameCheckStatusForm from '~/components/game/GameCheckStatusForm.vue'
import GameNicknameForm from '~/components/game/GameNicknameForm.vue'
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
