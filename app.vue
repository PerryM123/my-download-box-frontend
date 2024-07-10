<template>
  <div>
    <ClientOnly fallback-tag="span" fallback="Loading comments...">
      <SocketArea />
    </ClientOnly>
  </div>
</template>
<script lang="ts" setup>
import SocketArea from '@/components/SocketArea.vue'
</script>
