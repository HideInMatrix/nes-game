<script setup lang="ts">
import { Game } from "@/game";
import DisplayAd from "@/components/google/DisplayAd.vue";

defineProps<{
  gameInfo: Game;
}>();

const adClientId = import.meta.env.VITE_GOOGLE_ADSENSE_ID;
const displaySlot = import.meta.env.VITE_GOOGLE_ADSENSE_DISPLAY_SLOT;
</script>

<template>
  <div class="w-full bg-gray-900 text-white p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-4">{{ gameInfo.title }}</h1>
      <p class="text-gray-300 mb-6">{{ gameInfo.comment }}</p>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-400">Publisher:</span>
          <span class="ml-2">{{ gameInfo.publisher }}</span>
        </div>
        <div>
          <span class="text-gray-400">Developer:</span>
          <span class="ml-2">{{ gameInfo.source }}</span>
        </div>
      </div>
    </div>

    <DisplayAd
      :adStyle="{
        display: 'inline-block',
        width: '100%',
        height: '300px',
        'margin-top': '20px',
      }"
      :clientId="adClientId"
      :slotId="displaySlot" />
  </div>
</template>
