<template>
  <div>Hello Socket Area</div>
  <p>Number: {{ number }}</p>
  <p>connected state: {{ socketState.connected }}</p>
  <p>connected theNumber: {{ socketState.theNumber }}</p>

  <button @click="sendMessage">send</button>
  <button @click="connectMe">connect</button>
  <button @click="disconnectMe">Disconnect</button>
</template>
<script setup lang="ts">
import io from 'socket.io-client'
import { onMounted } from 'vue'
import { onBeforeUnmount } from 'vue'
import { onUnmounted } from 'vue'
import { ref } from 'vue'
import { socket, state as socketState } from '@/utils/socket'

if (process.client) {
  console.log('process.client: ')
  // [!code  focus]
  // This code will only run on the client-side
}
if (process.server) {
  console.log('process.server: ')
  // [!code  focus]
  // This code will only run on the client-side
}

const number = ref<Number>()

const sendMessage = () => {
  console.log('sendMessage')
}
const connectMe = () => {
  console.log('connectMe')

  socket.connect()
}
socket.on('number', (someNumber) => {
  number.value = someNumber
})
const disconnectMe = () => {
  console.log('disconnectMe')
  socket.disconnect()
}

onUnmounted(() => {
  // window.removeEventListener('click', yourFunction)
  console.log('onBeforeUnmount')
})
</script>
