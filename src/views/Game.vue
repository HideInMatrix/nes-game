<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import GameCanvas from "@/components/game/GameCanvas.vue";
import GameInfo from "@/components/game/GameInfo.vue";
import GameControls from "@/components/game/GameControls.vue";

const route = useRoute();
const gameId = route.params.id as string;

const gamepadConnected = ref([false, false]);

// NES Configuration
const p1Config = ref({
  UP: "KeyW",
  DOWN: "KeyS",
  LEFT: "KeyA",
  RIGHT: "KeyD",
  A: "KeyK",
  B: "KeyJ",
  SELECT: "Digit1",
  START: "Digit2",
});

const p2Config = ref({
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  A: "Numpad2",
  B: "Numpad1",
  C: "Numpad5",
  D: "Numpad4",
});

const nesConfig = ref({
  url: "/Super Mario Bros (JU).nes",
  p1: p1Config.value,
  p2: p2Config.value,
});

// Game Information
const gameInfo = {
  title: "Super Mario Bros",
  description:
    "Super Mario Bros. is a platform game developed and published by Nintendo. The successor to the 1983 arcade game Mario Bros. and the first Super Mario game, it was released in 1985 for the Nintendo Entertainment System (NES).",
  releaseDate: "September 13, 1985",
  publisher: "Nintendo",
  developer: "Nintendo R&D4",
};

// Gamepad Connection
const checkGamepad = () => {
  const gamepads = navigator.getGamepads();
  gamepads.forEach((gamepad, index) => {
    if (index < 2) {
      gamepadConnected.value[index] = gamepad !== null;
    }
  });
};

const canvasRef = ref();

onMounted(() => {
  window.addEventListener("gamepadconnected", (e) => {
    if (e.gamepad.index < 2) {
      gamepadConnected.value[e.gamepad.index] = true;
    }
  });

  window.addEventListener("gamepaddisconnected", (e) => {
    if (e.gamepad.index < 2) {
      gamepadConnected.value[e.gamepad.index] = false;
    }
  });

  checkGamepad();
});
</script>

<template>
  <div class="relative min-h-screen bg-dark overflow-hidden">
    <GameCanvas ref="canvasRef" :game-id="gameId" :config="nesConfig" />

    <GameInfo :game-info="gameInfo" />

    <GameControls
      :nes-ref="canvasRef?.nesRef"
      v-model:p1-config="p1Config"
      v-model:p2-config="p2Config"
      :gamepad-connected="gamepadConnected" />
  </div>
</template>

<style>
:root {
  overflow-y: scroll;
}

:root::-webkit-scrollbar {
  display: none;
}

:root {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
