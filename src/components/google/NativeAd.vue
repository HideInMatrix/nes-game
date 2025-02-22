<!-- NativeAd.vue 原生广告  -->
<script setup>
import BaseGoogleAd from "./BaseGoogleAd.vue";

defineProps({
  nativeFormat: {
    type: String,
    default: "image-centered",
  },
});
</script>

<template>
  <BaseGoogleAd
    v-bind="$attrs"
    format="native"
    :additionalAttributes="{
      'data-native-format': nativeFormat,
    }" />
</template>
