<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 w-full h-full bg-[rgba(230,253,260)] flex flex-col items-center justify-center z-[1000]">
      <svg class="w-[200px] h-[50px]" viewBox="0 0 200 50">
        <text x="10" y="35" class="text-[#333333] animate-stroke">
          {{ message }}
        </text>
      </svg>
    </div>
  </transition>
</template>

<script setup>
const visible = ref(false);
const message = ref("");

const open = (msg) => {
  message.value = msg;
  visible.value = true;
};

const close = () => {
  visible.value = false;
};

// 通过 defineExpose暴露open和close方法,显式地暴露组件内部的方法或属性，使得这些方法或属性可以在外部被访问和调用
defineExpose({
  open,
  close,
});
</script>
<style>
@keyframes stroke {
  0% {
    stroke-dasharray: 0 200;
    fill: transparent;
  }
  50% {
    stroke-dasharray: 100 100;
    fill: transparent;
  }
  100% {
    stroke-dasharray: 200 0;
    fill: #333333;
  }
}

.animate-stroke {
  font-size: 32px;
  font-weight: bold;
  fill: transparent;
  stroke: #333333;
  stroke-width: 1;
  stroke-dasharray: 200 0;
  animation: stroke 2s ease-in-out infinite alternate;
}

/* 控制淡入和淡出效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
