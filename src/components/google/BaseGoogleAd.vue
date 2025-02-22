<!-- BaseGoogleAd.vue -->
<script>
// 模块级加载状态管理
let scriptLoaded = false;
let loadingPromise = null;
</script>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  clientId: { type: String, required: true },
  slotId: { type: String, required: true },
  adStyle: { type: [String, Object], default: "display: block" },
  format: String,
  additionalAttributes: { type: Object, default: () => ({}) },
});

const mergedStyle = ref("");
const adElement = ref(null);

// 样式处理
const processStyle = () => {
  if (typeof props.adStyle === "string") {
    mergedStyle.value = props.adStyle;
  } else {
    mergedStyle.value = Object.entries(props.adStyle)
      .map(([k, v]) => `${k}:${v}`)
      .join(";");
  }
};

// 脚本加载逻辑
const loadScript = () => {
  return new Promise((resolve) => {
    if (scriptLoaded) return resolve();
    if (loadingPromise) return loadingPromise.then(resolve);

    loadingPromise = new Promise((scriptResolve) => {
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${props.clientId}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        scriptLoaded = true;
        scriptResolve();
      };
      document.head.appendChild(script);
    });

    loadingPromise.then(resolve);
  });
};

// 广告初始化
const initAd = () => {
  if (window.adsbygoogle) {
    try {
      window.adsbygoogle.push({});
    } catch (e) {
      console.error("Google ads init error:", e);
    }
  }
};

// 生命周期
onMounted(async () => {
  processStyle();
  await loadScript();
  initAd();
});

onUnmounted(() => {
  // 清理广告元素避免内存泄漏
  if (adElement.value) {
    adElement.value.innerHTML = "";
  }
});
</script>

<template>
  <ins
    ref="adElement"
    class="adsbygoogle"
    :style="mergedStyle"
    :data-ad-client="clientId"
    :data-ad-slot="slotId"
    :data-ad-format="format"
    v-bind="additionalAttributes"></ins>
</template>
