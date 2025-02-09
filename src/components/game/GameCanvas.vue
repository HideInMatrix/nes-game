<script setup lang="ts">
import type { NesVueInstance } from "@davidmorgan/nes-vue";
import { NesVue } from "@davidmorgan/nes-vue";

defineProps<{
  gameId: string;
  config: any;
}>();

const containerRef = ref<HTMLDivElement>();
const nesRef = ref<NesVueInstance>();
const canvasSize = ref({ width: 512, height: 480 });

const updateCanvasSize = () => {
  if (!containerRef.value) return;

  const container = containerRef.value;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const aspectRatio = 256 / 240;

  let width = containerWidth;
  let height = width / aspectRatio;

  if (height > containerHeight) {
    height = containerHeight;
    width = height * aspectRatio;
  }

  canvasSize.value = {
    width: Math.floor(width * window.devicePixelRatio),
    height: Math.floor(height * window.devicePixelRatio),
  };
};

defineExpose({
  nesRef,
  canvasSize,
});

onMounted(() => {
  updateCanvasSize();
  window.addEventListener("resize", updateCanvasSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateCanvasSize);
});
</script>

<template>
  <div
    ref="containerRef"
    class="w-full h-[100vh] bg-black flex items-center justify-center">
    <nes-vue
      ref="nesRef"
      v-bind="config"
      :width="canvasSize.width"
      :height="canvasSize.height"
      class="w-full h-full object-contain" />
  </div>
</template>
