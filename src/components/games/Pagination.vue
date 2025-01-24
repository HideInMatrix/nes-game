<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  "update:currentPage": [currentPage: number];
}>();

const changePage = (page: number) => {
  emit("update:currentPage", page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
    <button
      v-for="page in totalPages"
      :key="page"
      @click="changePage(page)"
      :class="{
        'bg-blue-600 text-white': currentPage === page,
        'bg-gray-800 text-gray-300 hover:bg-gray-700': currentPage !== page,
      }"
      class="min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-all duration-200 font-medium">
      {{ page }}
    </button>
  </div>
</template>
