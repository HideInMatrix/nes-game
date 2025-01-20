<script setup lang="ts">
import { excludes } from "@/router/keepAlive";
import Header from "./components/Header.vue";

const include: any[] = [];
</script>

<template>
  <div class="font-sans min-h-screen bg-dark">
    <Header />
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="include" :exclude="excludes">
        <component :is="Component" :key="route.path" class="" />
      </keep-alive>
    </router-view>
  </div>
</template>
