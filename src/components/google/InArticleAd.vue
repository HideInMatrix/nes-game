<!-- InArticleAd.vue 文章内嵌广告 -->
<script setup>
import BaseGoogleAd from "./BaseGoogleAd.vue";
</script>

<template>
  <BaseGoogleAd
    v-bind="$attrs"
    format="autorelaxed"
    :additionalAttributes="{
      'data-ad-layout': 'in-article',
    }" />
</template>
