<script setup lang="ts">
import { onMounted } from "vue";
import gsap from "gsap";

defineProps<{
  show: boolean;
}>();

onMounted(() => {
  gsap.to(".spinner", {
    rotate: 360,
    duration: 1,
    repeat: -1,
    ease: "none",
  });
});
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div
      class="spinner w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
  </div>
</template>
