<template>
  <div>Hello Socket Area</div>
  <p>Number: {{ number }}</p>
  <p>connected state: {{ socketState.connected }}</p>

  <button @click="sendMessage">send</button>
  <button @click="connectMe">connect</button>
  <button @click="disconnectMe">Disconnect</button>

  <div class="urlToAdd">
    <p>The Url To Add</p>
    <div>
      <input class="inputBox" type="text" v-model="urlText" />
    </div>
    <div>
      <button @click="addUrl">Add Url</button>
    </div>
  </div>

  <ProgressBar v-if="number" :progress-percent="number" />

  <div>
    <p>Url List</p>
    <ul v-if="urlList">
      <li v-for="singleItem in urlList">{{ singleItem }}</li>
    </ul>
    <p v-else>no items in list...</p>
  </div>

  <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

  <div v-if="filePath">Complete: {{ filePath }}</div>
</template>
<script setup lang="ts">
import io from 'socket.io-client'
import { onMounted } from 'vue'
import { onBeforeUnmount } from 'vue'
import { onUnmounted } from 'vue'
import { ref } from 'vue'
import { socket, state as socketState } from '@/utils/socket'

interface DownloadInfo {
  percentage?: number
  file_path?: string
}

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

const number = ref<number>()
const urlText = ref<String>(
  'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png'
)
const urlList = ref<String[]>([])
const filePath = ref<String>('')
const errorMessage = ref<String>('')

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
const addUrl = () => {
  console.log('function: addUrl: urlText.value: ', urlText.value)
  socket.emit('addUrl', urlText.value)
  urlText.value = ''
}
socket.on('updateUrls', (urlListFromServer: String[]) => {
  console.log('someNumber: ', urlListFromServer)
  urlList.value = urlListFromServer
})
socket.on('downloadProgress', (downloadInfo: DownloadInfo) => {
  console.log('percentage: ', downloadInfo.percentage)
  number.value = downloadInfo.percentage
})

socket.on('downloadComplete', (downloadInfo: DownloadInfo) => {
  console.log('file_path: ', downloadInfo.file_path)
  filePath.value = downloadInfo.file_path || ''
})

socket.on('alreadyDownloaded', (downloadInfo: DownloadInfo) => {
  console.log('file_path: ', downloadInfo.file_path)
  filePath.value = downloadInfo.file_path || ''
  errorMessage.value = 'Already downloaded!!'
})

onUnmounted(() => {
  console.log('onBeforeUnmount')
})
</script>
<style lang="scss" scoped>
.urlToAdd {
  border: 1px solid;
}
.inputBox {
  border: 1px solid;
}
.error {
  color: red;
}
</style>
