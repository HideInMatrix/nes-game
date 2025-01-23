<script setup lang="ts">
defineProps<{
  gameInfo: {
    title: string;
    description: string;
    releaseDate: string;
    publisher: string;
    developer: string;
  };
}>();
</script>

<template>
  <div class="w-full bg-gray-900 text-white p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-4">{{ gameInfo.title }}</h1>
      <p class="text-gray-300 mb-6">{{ gameInfo.description }}</p>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-400">Release Date:</span>
          <span class="ml-2">{{ gameInfo.releaseDate }}</span>
        </div>
        <div>
          <span class="text-gray-400">Publisher:</span>
          <span class="ml-2">{{ gameInfo.publisher }}</span>
        </div>
        <div>
          <span class="text-gray-400">Developer:</span>
          <span class="ml-2">{{ gameInfo.developer }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
