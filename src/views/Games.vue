<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import GameList from "@/components/games/GameList.vue";
import { useI18n } from "vue-i18n";

const isLoading = ref(true);
const { t } = useI18n();

onMounted(() => {
  gsap.to(isLoading, {
    value: false,
    duration: 0.5,
    delay: 0.3,
  });
});
</script>

<template>
  <LoadingSpinner :show="isLoading" />
  <div class="min-h-screen bg-dark py-8">
    <div class="max-w-7xl mx-auto px-8">
      <h1 class="text-4xl font-bold mb-8 text-white">{{ t("nav.games") }}</h1>
      <GameList />
    </div>
  </div>
</template>
