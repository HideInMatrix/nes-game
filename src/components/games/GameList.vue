<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import GameCard from "@/components/GameCard.vue";
import GameFilters from "./GameFilters.vue";
import Pagination from "./Pagination.vue";
import { Game } from "@/game";
import Api from "@/custom/axios";
import { getGamesByCategory } from "@/api";
import { Response } from "@/response";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// Mock data - in real app this would come from an API
const allGames = ref<Game[]>([]);

const itemsPerPage = 24;
const currentPage = ref(1);
const searchQuery = ref("");
const totalPages = ref(0);
const selectedCategory = ref("");

// Sync URL parameters with component state
onMounted(() => {
  const { page, search, category } = route.query;
  currentPage.value = page ? parseInt(page as string) : 1;
  searchQuery.value = (search as string) || "";
  selectedCategory.value = (category as string) || "";
});

// Update URL when filters or pagination change
const updateURL = () => {
  const query: Record<string, string> = {};

  if (currentPage.value > 1) {
    query.page = currentPage.value.toString();
  }
  if (searchQuery.value) {
    query.search = searchQuery.value;
  }
  if (selectedCategory.value) {
    query.category = selectedCategory.value;
  }

  router.replace({ query });
  getGames();
};

// Watch for changes and update URL
watch([currentPage, searchQuery, selectedCategory], () => {
  updateURL();
});

// Reset to first page when filters change
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1;
});

const getGames = () => {
  Api.get(
    getGamesByCategory(),
    {
      categoryId: selectedCategory.value ? selectedCategory.value : null,
      page: currentPage.value - 1,
      pageSize: itemsPerPage,
      keyword: searchQuery.value ? searchQuery.value : null,
    },
    (resp: Response) => {
      let data = resp.data as {
        games: Game[];
        totalGames: number;
        totalPages: number;
      };
      allGames.value = data.games as Game[];
      totalPages.value = data.totalPages;
    },
    (_err: any) => {}
  );
};
</script>

<template>
  <div class="space-y-6">
    <!-- Filters -->
    <GameFilters
      v-model:searchQuery="searchQuery"
      v-model:selectedCategory="selectedCategory" />

    <!-- Games Grid -->
    <div
      v-if="allGames.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <GameCard v-for="game in allGames" :key="game.id" :game="game" />
    </div>
    <div v-else class="text-center text-gray-400 py-12 text-lg">
      {{ t("base.noResults") }}
    </div>

    <!-- Pagination -->
    <Pagination v-model:currentPage="currentPage" :total-pages="totalPages" />
  </div>
</template>
