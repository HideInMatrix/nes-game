<!-- 基础组件 BaseGoogleAd.vue-->
<template>
  <component
    v-if="scriptSrc"
    async
    :is="'script'"
    :src="scriptSrc"
    crossorigin="anonymous"></component>
  <ins
    class="adsbygoogle"
    :style="mergedStyle"
    :data-ad-client="clientId"
    :data-ad-slot="slotId"
    :data-ad-format="format"
    v-bind="additionalAttributes">
  </ins>
  <component :is="'script'" v-if="scriptSrc">
    (adsbygoogle = window.adsbygoogle || []).push({});
  </component>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  clientId: { type: String, required: true },
  slotId: { type: String, required: true },
  adStyle: { type: [String, Object], default: "display: block" },
  format: String,
  additionalAttributes: { type: Object, default: () => ({}) },
});

const mergedStyle = computed(() => {
  if (typeof props.adStyle === "string") return props.adStyle;
  return Object.entries(props.adStyle)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
});

const scriptSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${props.clientId}`;
</script>
