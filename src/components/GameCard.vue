<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";
import { Game } from "@/game";
import { baseURL } from "@/api";

const props = defineProps<{
  game: Game;
}>();

const router = useRouter();
const cardRef = ref(null);

const navigateToGame = () => {
  router.push(`/game/${props.game.id}`);
};

const onMouseEnter = () => {
  gsap.to(cardRef.value, {
    scale: 1.05,
    duration: 0.3,
    ease: "power2.out",
  });
};

const onMouseLeave = () => {
  gsap.to(cardRef.value, {
    scale: 1,
    duration: 0.3,
    ease: "power2.out",
  });
};
</script>

<template>
  <div
    ref="cardRef"
    class="relative rounded-lg overflow-hidden cursor-pointer"
    @click="navigateToGame"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave">
    <img
      :src="`${baseURL}/roms/getFile?fileName=/img/${game.image}`"
      :alt="game.title"
      class="w-full h-[150px] object-cover" />
    <div
      class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
      <div class="text-white font-medium">{{ game.url }}</div>
    </div>
  </div>
</template>
