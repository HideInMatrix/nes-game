<script setup lang="ts">
import GameCard from "@/components/GameCard.vue";
import HeroSection from "@/components/HeroSection.vue";
import { getRomByCategory } from "@/api";
import Api from "@/custom/axios";
import { Response } from "@/response";

import LoadingPlugin from "@/plugins/loading";

import { Category } from "@/game";

import NativeAd from "@/components/google/NativeAd.vue";

const adClientId = import.meta.env.VITE_GOOGLE_ADSENSE_ID;

const slotArray = [3412561938, 4596527616];

const categories = ref<Category[]>([]);

onBeforeMount(() => {
  LoadingPlugin.open("MicroMatrix");
  Api.get(
    getRomByCategory(),
    null,
    (response: Response) => {
      categories.value = response.data as Category[];
      LoadingPlugin.close();
    },
    (_error: Response) => {
      LoadingPlugin.close();
    }
  );
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HeroSection />
    <!-- Game Categories -->
    <div class="max-w-7xl mx-auto px-8 py-8">
      <div
        v-for="(category, categoryIndex) in categories"
        :key="category.id"
        class="mb-12">
        <h2 class="text-3xl mb-6 text-white">
          {{ category.name }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <GameCard
            v-for="game in category.games"
            :key="game.id"
            :game="game" />
          <NativeAd
            v-if="categoryIndex < slotArray.length"
            :client-id="adClientId"
            :slot-id="slotArray[categoryIndex]"
            :ad-style="{
              display: 'inline-block',
              width: '100%',
              height: '100%',
            }"
            native-format="image-centered" />
        </div>
      </div>
    </div>
  </div>
</template>
