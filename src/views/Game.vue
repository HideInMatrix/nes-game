<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

import GameCanvas from "@/components/game/GameCanvas.vue";
import GameInfo from "@/components/game/GameInfo.vue";
import GameControls from "@/components/game/GameControls.vue";
import { Game } from "@/game";
import { baseURL, getRomById } from "@/api";
import Api from "@/custom/axios";
import { Response } from "@/response";

const router = useRouter();
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
  url: "",
  p1: p1Config.value,
  p2: p2Config.value,
});

// Game Information
const gameInfo = ref<Game>();

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

  if (gameId) {
    Api.get(
      getRomById(),
      { id: gameId },
      (resp: Response) => {
        gameInfo.value = resp.data as Game;
        nesConfig.value.url = `${baseURL}/roms/getFile?fileName=${
          (resp.data as Game).url
        }`;
      },
      (_error: Response) => {}
    );
  } else {
    router.back();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("gamepadconnected", (_e) => {});
  window.removeEventListener("gamepaddisconnected", (_e) => {});
});
</script>

<template>
  <div class="relative min-h-screen bg-dark overflow-hidden">
    <GameCanvas
      v-if="nesConfig.url"
      ref="canvasRef"
      :game-id="gameId"
      :config="nesConfig" />

    <GameInfo v-if="gameInfo" :game-info="gameInfo" />

    <GameControls
      :gameInfo="gameInfo"
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
