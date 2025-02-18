<template>
  <nav
    class="sticky top-0 w-full bg-black/90 py-4 z-50 transition-transform duration-300"
    :class="{ '-translate-y-full': !isNavVisible }">
    <div class="max-w-7xl mx-auto px-8 flex justify-between items-center">
      <div class="text-2xl font-bold text-white flex items-center">
        <img
          src="/favicon.ico"
          alt="Logo"
          class="w-8 h-8 mr-2 mix-blend-screen" />
        GamePortal
      </div>
      <div class="flex items-center gap-8">
        <div class="flex gap-8">
          <a
            v-for="link in menus"
            :key="link.url"
            :href="`${link.url}`"
            class="text-white font-medium hover:text-blue-400 transition-colors">
            {{ t(`nav.${link.name}`) }}
          </a>
        </div>
        <button
          @click="toggleLanguage"
          class="px-3 py-1 rounded border border-white/20 text-white hover:bg-white/10 transition-colors">
          {{ locale === "zh" ? "EN" : "中" }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();

// 导航栏显示控制
const isNavVisible = ref(true);
const lastScrollPosition = ref(0);
const SCROLL_THRESHOLD = 50;

const menus = [
  { name: "home", url: "/" },
  { name: "games", url: "/games" },
  { name: "localGames", url: "/local-games" },
];

const handleScroll = () => {
  const currentScrollPosition = window.scrollY;
  if (
    Math.abs(currentScrollPosition - lastScrollPosition.value) <
    SCROLL_THRESHOLD
  )
    return;

  isNavVisible.value = currentScrollPosition < lastScrollPosition.value;
  lastScrollPosition.value = currentScrollPosition;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// 切换语言
const toggleLanguage = () => {
  locale.value = locale.value === "zh" ? "en" : "zh";
};
</script>
