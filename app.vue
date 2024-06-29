<template>
  <div>
    <ClientOnly fallback-tag="span" fallback="Loading comments...">
      <SocketArea />
    </ClientOnly>
    <!-- TODO: auto-importやめよう -->
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
<script lang="ts" setup>
import SocketArea from '@/components/SocketArea.vue'
</script>
