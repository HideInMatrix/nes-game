<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'

const route = useRoute()
const { t } = useI18n()
const gameId = route.params.id as string
const isLoading = ref(true)

onMounted(() => {
  gsap.to(isLoading, {
    value: false,
    duration: 0.5,
    delay: 0.5
  })
})
</script>

<template>
  <LoadingSpinner :show="isLoading" />
  <div class="min-h-screen bg-dark text-white p-8">
    <h1 class="text-4xl font-bold mb-4">{{ t(`games.${gameId}`) }}</h1>
    <!-- 这里添加游戏详情页的内容 -->
  </div>
</template>