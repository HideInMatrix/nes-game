<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Upload, Clock, Trash2 } from "lucide-vue-next";
import GameCanvas from "@/components/game/GameCanvas.vue";
import GameControls from "@/components/game/GameControls.vue";
import { Game } from "@/game";

const { t } = useI18n();

interface RecentFile {
  id: string;
  name: string;
  data: Blob;
  timestamp: number;
  url: string;
}

const isDragging = ref(false);
const showUpload = ref(true);
const gameUrl = ref("");
const recentFiles = ref<RecentFile[]>([]);
const canvasRef = ref();

// IndexedDB setup
const DB_NAME = "RomLibraryDB";
const STORE_NAME = "roms";
let db: IDBDatabase;
const gameInfo = ref<Game>();

const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

// NES Configuration
const p1Config = ref({
  UP: "KeyW",
  DOWN: "KeyS",
  LEFT: "KeyA",
  RIGHT: "KeyD",
  A: "KeyK",
  B: "KeyJ",
  SELECT: "Digit2",
  START: "Digit1",
});

const p2Config = ref({
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  A: "Numpad2",
  B: "Numpad1",
  SELECT: "Digit0",
  START: "Enter",
});

const nesConfig = computed(() => ({
  url: gameUrl.value,
  p1: p1Config.value,
  p2: p2Config.value,
}));

const gamepadConnected = ref([false, false]);

// 用来缓存文件和 URL 对应关系的函数
function getFileUrl(file: { name: string; data: Blob }): Promise<string> {
  const fileHash = file.name;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const fileRequest = store.get(fileHash);

      fileRequest.onsuccess = () => {
        if (fileRequest.result) {
          resolve(fileRequest.result.url);
        } else {
          const fileUrl = URL.createObjectURL(file.data);

          const saveRequest = store.put({
            id: fileHash,
            url: fileUrl,
            data: file.data,
          });

          saveRequest.onsuccess = () => resolve(fileUrl);
          saveRequest.onerror = () => reject("Failed to save file URL");
        }
      };

      fileRequest.onerror = () =>
        reject("Failed to retrieve file from IndexedDB");
    };

    request.onerror = () => reject("Failed to open IndexedDB");
  });
}

const loadRoms = async () => {
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      recentFiles.value = request.result.sort(
        (a, b) => b.timestamp - a.timestamp
      );
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
};

onMounted(async () => {
  try {
    await initDB();
    await loadRoms();
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
});

const saveToIndexedDB = async (file: RecentFile): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(file);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const deleteFromIndexedDB = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const handleFile = async (file: File) => {
  if (!file.name.toLowerCase().endsWith(".nes")) {
    alert(t("localGames.invalidFile"));
    return;
  }

  try {
    const id = encodeURIComponent(file.name);
    gameUrl.value = URL.createObjectURL(file);
    const newFile: RecentFile = {
      id: id,
      name: file.name,
      data: file,
      timestamp: Date.now(),
      url: gameUrl.value,
    };

    await saveToIndexedDB(newFile);
    await loadRoms();

    gameInfo.value = {
      id: id,
      title: file.name,
      image: "",
      url: gameUrl.value,
      comment: "",
      publisher: "",
      source: "",
      type: "",
    };

    showUpload.value = false;
  } catch (error) {
    console.error("Error loading ROM:", error);
    alert(t("localGames.invalidFile"));
  } finally {
  }
};

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;

  const file = e.dataTransfer?.files[0];
  if (file) {
    handleFile(file);
  }
};

const onFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    handleFile(file);
  }
  // Reset the input value to allow selecting the same file again
  (e.target as HTMLInputElement).value = "";
};

const loadRecentFile = (file: RecentFile) => {
  gameUrl.value = URL.createObjectURL(file.data);
  showUpload.value = false;
  gameInfo.value = {
    id: encodeURIComponent(file.name),
    title: file.name,
    image: "",
    url: gameUrl.value,
    comment: "",
    publisher: "",
    source: "",
    type: "",
  };
};

const deleteFile = async (file: RecentFile, event: Event) => {
  event.stopPropagation();

  try {
    await deleteFromIndexedDB(file.id);
    await loadRoms();

    // If the deleted file was the current game, reset the view
    if (showUpload.value === false) {
      resetUpload();
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

const resetUpload = () => {
  showUpload.value = true;
  gameUrl.value = "";
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};
</script>

<template>
  <div class="min-h-contain bg-dark">
    <div class="max-w-7xl mx-auto px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-white">
          {{ t("localGames.title") }}
        </h1>
        <button
          v-if="!showUpload"
          @click="resetUpload"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          {{ t("localGames.uploadNew") }}
        </button>
      </div>

      <div class="flex gap-8">
        <!-- Main Content -->
        <div class="flex-1">
          <div v-if="showUpload" class="relative">
            <!-- Upload Area -->
            <div
              @dragenter.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @dragover.prevent
              @drop="onDrop"
              class="w-full h-[400px] border-2 border-dashed rounded-lg flex items-center justify-center transition-colors"
              :class="
                isDragging
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              ">
              <input
                type="file"
                accept=".nes"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                @change="onFileSelect" />
              <div class="text-center">
                <Upload class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-300">{{ t("localGames.dropzone") }}</p>
              </div>
            </div>
          </div>

          <!-- Game Canvas -->
          <div v-else>
            <GameCanvas
              ref="canvasRef"
              :game-id="'local'"
              :config="nesConfig" />
            <GameControls
              :game-info="gameInfo"
              :nes-ref="canvasRef?.nesRef"
              v-model:p1-config="p1Config"
              v-model:p2-config="p2Config"
              :gamepad-connected="gamepadConnected" />
          </div>
        </div>

        <!-- Recent Files Sidebar -->
        <div class="w-80 bg-gray-900 rounded-lg p-6">
          <h2 class="text-xl font-bold text-white mb-4">
            {{ t("localGames.recentFiles") }}
          </h2>
          <div v-if="recentFiles.length > 0" class="space-y-3">
            <div
              v-for="file in recentFiles"
              :key="file.id"
              @click="loadRecentFile(file)"
              class="group relative flex items-start gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors">
              <Clock class="w-5 h-5 text-gray-400 mt-1" />
              <div class="flex-grow pr-8">
                <div class="text-white font-medium">{{ file.name }}</div>
                <div class="text-sm text-gray-400">
                  {{ formatDate(file.timestamp) }}
                </div>
              </div>
              <button
                @click="deleteFile(file, $event)"
                class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded transition-all">
                <Trash2 class="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
          <div v-else class="text-gray-400 text-center py-8">
            {{ t("localGames.noRecentFiles") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
