<script setup lang="ts">
import GameCard from "@/components/GameCard.vue";
import HeroSection from "@/components/HeroSection.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Game {
  id: number;
  title: string;
  key: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
  key: string;
  games: Game[];
}
const categories: Category[] = [
  {
    id: 0,
    name: t("categories.action"),
    key: "action",
    games: [
      {
        id: 0,
        title: "只狼：影逝二度",
        key: "sekiro",
        image:
          "https://images.unsplash.com/photo-1538481199706-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 1,
        title: "只狼：影逝二度",
        key: "elden-ring",
        image:
          "https://images.unsplash.com/photo-1552820729-8b83bb6b773f?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        title: "只狼：影逝二度",
        key: "dmc4",
        image:
          "https://images.unsplash.com/photo-1548435408-2d726a49b613?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: 1,
    name: "只狼：影逝二度",
    key: "rpg",
    games: [
      {
        id: 3,
        title: "只狼：影逝二度",
        key: "ff15",
        image:
          "https://images.unsplash.com/photo-1542751372-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: 2,
    name: t("categories.strategy"),
    key: "strategy",
    games: [
      {
        id: 6,
        title: "只狼：影逝二度",
        key: "civ5",
        image:
          "https://images.unsplash.com/photo-1547118134-ecb78a98c545?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
];
</script>

<template>
  <div>
  <!-- Hero Section -->
    <HeroSection />
    <!-- Game Categories -->
    <div class="max-w-7xl mx-auto px-8 py-8">
      <div v-for="category in categories" :key="category.id" class="mb-12">
        <h2 class="text-3xl mb-6 text-white">
          {{ t(`categories.${category.key}`) }}
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
