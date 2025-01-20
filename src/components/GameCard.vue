<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import gsap from "gsap";

const props = defineProps<{
  game: {
    id: number;
    key: string;
    image: string;
  };
}>();

const { t } = useI18n();
const router = useRouter();
const cardRef = ref(null);

const navigateToGame = () => {
  router.push(`/game/${props.game.key}`);
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
      :src="game.image"
      :alt="game.key"
      class="w-full h-[150px] object-cover" />
    <div
      class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
      <div class="text-white font-medium">{{ game.key }}</div>
    </div>
  </div>
</template>
