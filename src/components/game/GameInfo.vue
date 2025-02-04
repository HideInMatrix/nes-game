<script setup lang="ts">
import { Game } from "@/game";

defineProps<{
  gameInfo: Game;
}>();
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
  </div>
</template>
