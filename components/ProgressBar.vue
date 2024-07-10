<template>
  <div>Progress Bar</div>
  <div class="progressBarArea">
    <div
      class="progressPercent"
      :style="progressStyles"
      style="progressPercent"
    ></div>
  </div>
  <p>{{ progressPercent }}%</p>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  progressPercent: Number
})
const progressStyles = computed(() => {
  return {
    '--progress-progress': `${props.progressPercent}%`
  }
})
</script>
<style lang="scss" scoped>
.progressBarArea {
  width: 100%;
  height: 60px;
  border: 4px solid;
  box-sizing: border-box;
}

.progressPercent {
  width: var(--progress-progress);
  height: 100%;
  background: #00ffb7;
  box-sizing: border-box;
}
</style>
