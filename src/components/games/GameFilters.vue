<script setup lang="ts">
import { Search, ChevronDown } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps<{
  searchQuery: string;
  selectedCategory: string;
}>();

const emit = defineEmits<{
  "update:searchQuery": [value: string];
  "update:selectedCategory": [value: string];
}>();

const categories = [
  { value: "", label: t("games.allCategories") },
  { value: "action", label: t("categories.action") },
  { value: "rpg", label: t("categories.rpg") },
  { value: "strategy", label: t("categories.strategy") },
];
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 mb-6">
    <!-- Search Input -->
    <div class="relative flex-1">
      <Search
        class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        :value="searchQuery"
        @input="e => emit('update:searchQuery', (e.target as HTMLInputElement).value)"
        type="text"
        :placeholder="t('games.searchPlaceholder')"
        class="w-full pl-10 pr-4 py-2.5 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-400 transition-all duration-200" />
    </div>

    <!-- Category Dropdown -->
    <div class="relative min-w-[200px]">
      <select
        :value="selectedCategory"
        @change="e => emit('update:selectedCategory', (e.target as HTMLSelectElement).value)"
        class="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer transition-all duration-200">
        <option
          v-for="category in categories"
          :key="category.value"
          :value="category.value"
          class="bg-gray-800 text-gray-100">
          {{ category.label }}
        </option>
      </select>
      <ChevronDown
        class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  </div>
</template>
