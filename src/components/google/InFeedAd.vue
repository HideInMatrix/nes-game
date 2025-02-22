<!-- InFeedAd.vue 信息流广告  -->
<script setup>
import BaseGoogleAd from "./BaseGoogleAd.vue";
</script>

<template>
  <BaseGoogleAd
    v-bind="$attrs"
    format="fluid"
    :additionalAttributes="{
      'data-ad-layout': 'in-feed',
      'data-ad-format': 'horizontal',
    }" />
</template>
