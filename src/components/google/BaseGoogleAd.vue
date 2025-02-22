<!-- BaseGoogleAd.vue -->
<script>
// 模块级全局状态
let scriptLoaded = false;
let loadingPromise = null;
const adRegistry = new Set(); // 广告实例注册表
const initQueue = []; // 初始化队列
let initTimer = null;
</script>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect, computed } from "vue";

const props = defineProps({
  clientId: { type: String, required: true },
  slotId: { type: String, required: true },
  adStyle: { type: [String, Object], default: "display: block" },
  format: String,
  lazyLoad: { type: Boolean, default: false }, // 懒加载开关
  additionalAttributes: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["loaded", "error"]);
const adElement = ref(null);
const adStatus = ref("pending"); // 状态：pending/loading/loaded/error

// 样式处理
const mergedStyle = computed(() => {
  if (typeof props.adStyle === "string") return props.adStyle;
  return Object.entries(props.adStyle)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
});

// 脚本加载器
const loadScript = () => {
  return new Promise((resolve, reject) => {
    if (scriptLoaded) return resolve();
    if (loadingPromise) return loadingPromise.then(resolve);

    loadingPromise = new Promise((scriptResolve, scriptReject) => {
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${props.clientId}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        scriptLoaded = true;
        scriptResolve();
      };
      script.onerror = (err) => {
        scriptReject(err);
        console.error("Google Ads script load failed:", err);
      };
      document.head.appendChild(script);
    });

    loadingPromise.then(resolve).catch(reject);
  });
};

// 广告初始化
const initAd = () => {
  if (!window.adsbygoogle) {
    adStatus.value = "error";
    emit("error", new Error("Google Ads API not loaded"));
    return;
  }

  try {
    window.adsbygoogle.push({});
    adStatus.value = "loading";
    console.log(`Ad initialized: ${props.slotId}`);
  } catch (e) {
    adStatus.value = "error";
    emit("error", e);
  }
};

// 队列批处理初始化
const queueInit = () => {
  initQueue.push(initAd);

  if (!initTimer) {
    initTimer = setTimeout(() => {
      initQueue.forEach((fn) => fn());
      initQueue.length = 0;
      initTimer = null;
    }, 50);
  }
};

// 可见性观察器
let observer = null;
const setupObserver = () => {
  if (!props.lazyLoad || !adElement.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startLoad();
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "200px",
      threshold: 0.01,
    }
  );

  observer.observe(adElement.value);
};

// 加载流程
const startLoad = async () => {
  if (adRegistry.has(props.slotId)) {
    console.warn(`Duplicate ad slot-id detected: ${props.slotId}`);
    return;
  }

  try {
    adStatus.value = "loading";
    await loadScript();
    adRegistry.add(props.slotId);
    queueInit();
  } catch (e) {
    adStatus.value = "error";
    emit("error", e);
  }
};

// 生命周期
onMounted(() => {
  if (props.lazyLoad) {
    setupObserver();
  } else {
    startLoad();
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  adRegistry.delete(props.slotId);
  if (adElement.value) {
    adElement.value.innerHTML = "";
  }
});

// 状态追踪
watchEffect(() => {
  if (adElement.value?.dataset?.adStatus === "filled") {
    emit("loaded", props.slotId);
    adStatus.value = "loaded";
  }
});

// 暴露刷新方法
const refreshAd = () => {
  if (adElement.value) {
    adElement.value.innerHTML = "";
    delete adElement.value.dataset.adStatus;
    startLoad();
  }
};

defineExpose({ refreshAd, adStatus });
</script>

<template>
  <div class="flex items-center flex-col justify-center relative">
    <ins
      ref="adElement"
      class="adsbygoogle"
      :style="mergedStyle"
      :data-ad-client="clientId"
      :data-ad-slot="slotId"
      :data-ad-format="format"
      :data-ad-status="adStatus"
      v-bind="additionalAttributes"></ins>

    <!-- 加载状态提示 -->
    <!-- <div v-if="adStatus === 'loading'" class="ad-loading absolute">
      Loading advertisement...
    </div>
    <div v-if="adStatus === 'error'" class="ad-error absolute">
      Failed to load advertisement
    </div> -->
  </div>
</template>

<style>
.adsbygoogle[data-ad-status="filled"] {
  opacity: 1;
  transition: opacity 0.3s;
}

.adsbygoogle[data-ad-status="loading"],
.adsbygoogle[data-ad-status="pending"] {
  opacity: 0;
  height: 0;
  overflow: hidden;
}

.ad-loading,
.ad-error {
  padding: 20px;
  text-align: center;
  background: #f5f5f5;
}

.ad-error {
  color: #dc3545;
  border-color: #dc3545;
}
</style>
