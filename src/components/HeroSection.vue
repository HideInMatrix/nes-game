<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import gsap from "gsap";

const { t } = useI18n();
const router = useRouter();
const heroRef = ref(null);

const playGame = () => {
  router.push(`/game/ff16`);
};

onMounted(() => {
  gsap.from(heroRef.value, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
  });
});
</script>

<template>
  <div
    ref="heroRef"
    class="h-[600px] bg-cover bg-center flex items-center justify-center relative"
    style="
      background-image: url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80');
    ">
    <div class="absolute inset-0 bg-black/50"></div>
    <div class="text-center text-white z-10 px-8">
      <h1 class="text-5xl mb-4">{{ t("hero.title") }}</h1>
      <p class="text-xl max-w-2xl mx-auto mb-8">
        {{ t("hero.description") }}
      </p>
      <button
        @click="playGame"
        class="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium transition-colors">
        {{ t("hero.playButton") }}
      </button>
    </div>
  </div>
</template>
