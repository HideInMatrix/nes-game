<script setup lang="ts">
import GameList from "@/components/games/GameList.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="min-h-screen bg-dark py-8">
    <div class="max-w-7xl mx-auto px-8">
      <h1 class="text-4xl font-bold mb-8 text-white">{{ t("nav.games") }}</h1>
      <GameList />
    </div>
  </div>
</template>
