<script setup lang="ts">
import GameCard from "@/components/GameCard.vue";
import HeroSection from "@/components/HeroSection.vue";
import { getRomByCategory } from "@/api";
import Api from "@/custom/axios";
import { Response } from "@/response";

import { Category } from "@/game";

const categories = ref<Category[]>([]);

onBeforeMount(() => {
  Api.get(
    getRomByCategory(),
    null,
    (response: Response) => {
      categories.value = response.data as Category[];
    },
    (_error: Response) => {}
  );
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HeroSection />
    <!-- Game Categories -->
    <div class="max-w-7xl mx-auto px-8 py-8">
      <div v-for="category in categories" :key="category.id" class="mb-12">
        <h2 class="text-3xl mb-6 text-white">
          {{ category.name }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <GameCard
            v-for="game in category.games"
            :key="game.id"
            :game="game" />
        </div>
      </div>
    </div>
  </div>
</template>
