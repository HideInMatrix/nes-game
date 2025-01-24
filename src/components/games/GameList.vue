<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import GameCard from "@/components/GameCard.vue";
import GameFilters from "./GameFilters.vue";
import Pagination from "./Pagination.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

interface Game {
  id: number;
  key: string;
  image: string;
  category: string;
  releaseDate: string;
  publisher: string;
}

// Mock data - in real app this would come from an API
const allGames = ref<Game[]>([
  {
    id: 1,
    key: "sekiro",
    image:
      "https://images.unsplash.com/photo-1538481199706-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    category: "action",
    releaseDate: "2019-03-22",
    publisher: "FromSoftware",
  },
  {
    id: 2,
    key: "elden-ring",
    image:
      "https://images.unsplash.com/photo-1552820729-8b83bb6b773f?auto=format&fit=crop&w=800&q=80",
    category: "action",
    releaseDate: "2022-02-25",
    publisher: "FromSoftware",
  },
  {
    id: 3,
    key: "ff16",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    category: "rpg",
    releaseDate: "2023-06-22",
    publisher: "Square Enix",
  },
]);

const itemsPerPage = 6;
const currentPage = ref(1);
const searchQuery = ref("");
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
};

// Watch for changes and update URL
watch([currentPage, searchQuery, selectedCategory], () => {
  updateURL();
});

const filteredGames = computed(() => {
  return allGames.value.filter((game) => {
    const matchesSearch = t(`games.${game.key}`)
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesCategory =
      !selectedCategory.value || game.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

const totalPages = computed(() =>
  Math.ceil(filteredGames.value.length / itemsPerPage)
);

const paginatedGames = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredGames.value.slice(start, end);
});

// Reset to first page when filters change
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1;
});
</script>

<template>
  <div class="space-y-6">
    <!-- Filters -->
    <GameFilters
      v-model:searchQuery="searchQuery"
      v-model:selectedCategory="selectedCategory" />

    <!-- Games Grid -->
    <div
      v-if="paginatedGames.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <GameCard v-for="game in paginatedGames" :key="game.id" :game="game" />
    </div>
    <div v-else class="text-center text-gray-400 py-12 text-lg">
      {{ t("games.noResults") }}
    </div>

    <!-- Pagination -->
    <Pagination v-model:page="currentPage" :total-pages="totalPages" />
  </div>
</template>
