<!-- DisplayAd.vue 展示广告 -->
<script setup>
import BaseGoogleAd from "./BaseGoogleAd.vue";

defineProps({
  layoutKey: String,
  layout: String,
});
</script>

<template>
  <BaseGoogleAd
    v-bind="$attrs"
    format="auto"
    :additionalAttributes="{
      'data-ad-format': layout ? 'autorelaxed' : 'auto',
      'data-ad-layout-key': layoutKey,
      'data-ad-layout': layout,
    }" />
</template>
