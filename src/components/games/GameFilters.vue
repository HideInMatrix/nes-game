<script setup lang="ts">
import { Search, ChevronDown } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { Category } from "@/game";
import { getCategories } from "@/api";
import Api from "@/custom/axios";
import { Response } from "@/response";

const { t } = useI18n();

defineProps<{
  searchQuery: string;
  selectedCategory: string;
}>();

const emit = defineEmits<{
  "update:searchQuery": [value: string];
  "update:selectedCategory": [value: string];
}>();

const categories = ref<Category[]>([{ id: "", name: t("base.allCategories") }]);

onBeforeMount(() => {
  Api.get(
    getCategories(),
    null,
    (response: Response) => {
      categories.value = [
        ...categories.value,
        ...(response.data as Category[]),
      ];
    },
    (_error: any) => {}
  );
});
let timer: NodeJS.Timeout | null = null;
const handleInput = (e: Event) => {
  if (timer) clearTimeout(timer); // 清除之前的定时器
  timer = setTimeout(() => {
    emit("update:searchQuery", (e.target as HTMLInputElement).value);
  }, 300); // 300ms 为节流的时间间隔
};
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 mb-6">
    <!-- Search Input -->
    <div class="relative flex-1">
      <Search
        class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        :value="searchQuery"
        @input="handleInput"
        type="text"
        :placeholder="t('base.searchPlaceholder')"
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
          :key="category.id"
          :value="category.id"
          class="bg-gray-800 text-gray-100">
          {{ category.name }}
        </option>
      </select>
      <ChevronDown
        class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  </div>
</template>
