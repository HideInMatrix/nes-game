<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { Settings2, Save, Clock, Trash2 } from "lucide-vue-next";
import type { NesVueInstance } from "@davidmorgan/nes-vue";
import { Game } from "@/game";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const { t } = useI18n();
const props = defineProps<{
  nesRef: NesVueInstance | undefined;
  p1Config: Record<string, string>;
  p2Config: Record<string, string>;
  gamepadConnected: boolean[];
  gameInfo: Game | undefined;
}>();

const emit = defineEmits(["update:p1Config", "update:p2Config"]);

const showControls = ref(false);
const controlsRef = ref(null);
const activeInput = ref<string | null>(null);

interface SaveSlot {
  id: string;
  date: string;
}

const saveSlots = ref<SaveSlot[]>([]);

const startKeyMapping = (player: "p1" | "p2", key: string) => {
  activeInput.value = `${player}-${key}`;
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (!activeInput.value) return;

  const [player, key] = activeInput.value.split("-");
  const config =
    player === "p1" ? { ...props.p1Config } : { ...props.p2Config };
  config[key as keyof typeof config] = e.code;

  if (player === "p1") {
    emit("update:p1Config", config);
  } else {
    emit("update:p2Config", config);
  }

  activeInput.value = null;
  e.preventDefault();
  e.stopPropagation();
};

const createSaveSlot = () => {
  if (!props.nesRef) return;

  const newSlotId = saveSlots.value.length + 1;
  const currentDate = new Date().toLocaleString();
  if (props.gameInfo) {
    props.nesRef.save(`${props.gameInfo.title}-${newSlotId}`);
    saveSlots.value.push({
      id: `${props.gameInfo.title}-${newSlotId}`,
      date: currentDate,
    });
  }
};

const loadProgress = (slot: SaveSlot) => {
  if (props.nesRef && props.gameInfo) {
    props.nesRef.load(`${slot.id}`);
  }
};

const deleteSlot = (slot: SaveSlot, event: Event) => {
  event.stopPropagation();

  // 从 IndexedDB 删除存档
  if (window.indexedDB) {
    const dbRequest = indexedDB.open("nes-vue", 1);

    dbRequest.onsuccess = (e: any) => {
      const db = e.target.result;
      const transaction = db.transaction("save_data", "readwrite");
      const store = transaction.objectStore("save_data");

      // 删除指定的存档
      const deleteRequest = store.delete(slot.id);

      deleteRequest.onsuccess = () => {
        console.log(`Slot ${slot.id} deleted from IndexedDB`);
      };

      deleteRequest.onerror = () => {
        console.error(`Failed to delete Slot ${slot.id} from IndexedDB`);
      };
    };

    dbRequest.onerror = () => {
      console.error("Error opening IndexedDB.");
    };
  }

  const index = saveSlots.value.findIndex((s) => s.id === slot.id);
  if (index !== -1) {
    saveSlots.value.splice(index, 1);
    // Reorder remaining slots
    saveSlots.value = saveSlots.value.map((s, idx) => ({
      ...s,
      id: `${props.gameInfo!.title}-${idx + 1}`,
    }));
  }
};

const checkSaveSlots = async () => {
  if (!window.indexedDB) {
    console.warn("Your browser does not support IndexedDB.");
    return;
  }

  const dbRequest = indexedDB.open("nes-vue", 1);

  dbRequest.onsuccess = (e: any) => {
    const db = e.target.result;
    const transaction = db.transaction("save_data", "readonly");
    const store = transaction.objectStore("save_data");

    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = (event: any) => {
      const savedSlots = event.target.result;
      if (savedSlots && savedSlots.length > 0) {
        saveSlots.value = savedSlots.filter((slot: any) => {
          let name = slot.id.split("-")[0];
          if (props.gameInfo && props.gameInfo.title === name) {
            return {
              id: slot.id,
              date: slot.date,
            };
          }
        });
      }
    };

    getAllRequest.onerror = () => {
      console.error("Error reading from IndexedDB.");
    };
  };

  dbRequest.onerror = () => {
    console.error("Error opening IndexedDB.");
  };
};

const toggleControlsMenu = () => {
  showControls.value = !showControls.value;
};
const hasSeenTooltip = ref(localStorage.getItem("hasSeenTooltip") === "true");
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);

  if (!hasSeenTooltip.value) {
    const driverObj = driver();
    driverObj.highlight({
      element: "button svg", // 或者你可以根据按钮的类名或ID来选择
      popover: {
        title: "设置",
        description: "点击这个按钮打开设置菜单",
      },
    });
    localStorage.setItem("hasSeenTooltip", "true");
  }
});

watch(
  () => props.gameInfo,
  () => {
    checkSaveSlots();
  },
  { deep: true, immediate: true }
);
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <button
    @click="toggleControlsMenu"
    class="fixed top-4 right-4 z-50 p-2 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg transition-colors">
    <Settings2 class="h-6 w-6 text-white" />
  </button>

  <div
    v-show="showControls"
    class="fixed inset-y-0 right-0 bg-black/90 text-white p-6 transform transition-transform duration-300 grid grid-cols-2 gap-4 z-50"
    :class="showControls ? 'translate-x-0' : 'translate-x-full'"
    style="overflow-y: auto; scrollbar-width: none; -ms-overflow-style: none"
    ref="controlsRef">
    <button
      @click="toggleControlsMenu"
      class="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg transition-colors">
      <Settings2 class="h-6 w-6 text-white" />
    </button>

    <h2 class="text-2xl font-bold mb-6 col-span-2">
      {{ t("controls.title") }}
    </h2>

    <!-- Save Progress -->
    <div class="mb-8 col-span-2">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl">{{ t("controls.saveProgress") }}</h3>
        <button
          @click="createSaveSlot"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
          <Save class="h-4 w-4" />
          {{ t("controls.slot") }}
        </button>
      </div>

      <!-- Save Slots -->
      <div v-if="saveSlots.length > 0" class="space-y-2">
        <div
          v-for="slot in saveSlots"
          :key="slot.id"
          class="group relative w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors cursor-pointer"
          @click="loadProgress(slot)">
          <Clock class="h-5 w-5 text-gray-400" />
          <div class="text-left flex-grow">
            <div class="font-medium">
              {{ t("controls.slot") }} {{ slot.id }}
            </div>
            <div class="text-sm text-gray-400">{{ slot.date }}</div>
          </div>
          <button
            @click="deleteSlot(slot, $event)"
            class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded">
            <Trash2 class="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>

    <!-- Player 1 Controls -->
    <div class="mb-8">
      <h3 class="text-xl mb-4">{{ t("controls.player1") }}</h3>
      <div class="space-y-4">
        <div
          v-for="(value, key) in p1Config"
          :key="`p1-${key}`"
          class="flex items-center">
          <span class="w-20">{{ key }}</span>
          <input
            :value="value"
            readonly
            @click="startKeyMapping('p1', key)"
            :class="{ 'ring-2 ring-blue-500': activeInput === `p1-${key}` }"
            class="ml-4 px-2 py-1 bg-gray-700 rounded text-white cursor-pointer"
            type="text"
            :placeholder="t('controls.pressKey')" />
        </div>
      </div>
    </div>

    <!-- Player 2 Controls -->
    <div class="mb-8">
      <h3 class="text-xl mb-4">{{ t("controls.player2") }}</h3>
      <div class="space-y-4">
        <div
          v-for="(value, key) in p2Config"
          :key="`p2-${key}`"
          class="flex items-center">
          <span class="w-20">{{ key }}</span>
          <input
            :value="value"
            readonly
            @click="startKeyMapping('p2', key)"
            :class="{ 'ring-2 ring-blue-500': activeInput === `p2-${key}` }"
            class="ml-4 px-2 py-1 bg-gray-700 rounded text-white cursor-pointer"
            type="text"
            :placeholder="t('controls.pressKey')" />
        </div>
      </div>
    </div>

    <!-- Gamepad Status -->
    <div class="mb-8">
      <h3 class="text-xl mb-4">{{ t("controls.gamepad") }}</h3>
      <div class="space-y-2">
        <div
          v-for="(connected, index) in gamepadConnected"
          :key="index"
          class="flex items-center">
          <span class="w-20">P{{ index + 1 }}</span>
          <span
            :class="connected ? 'text-green-500' : 'text-red-500'"
            class="text-sm ml-2">
            {{
              connected ? t("controls.connected") : t("controls.disconnected")
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
