<template>
  <div>Hello Socket Area</div>
  <p>connected state: {{ socketState.connected }}</p>
  <button @click="sendMessage">send</button>
  <button @click="connectMe">connect</button>
  <button @click="disconnectMe">Disconnect</button>

  <div class="urlToAdd">
    <p>The Url To Add</p>
    <div>
      <input
        class="inputBox"
        type="text"
        ref="urlBoxRef"
        v-model="urlText"
        @keydown.enter="addUrl"
      />
    </div>
    <div>
      <button @click="addUrl">Add Url</button>
    </div>
  </div>

  <ProgressBar
    v-if="downloadPercentage"
    :progress-percent="downloadPercentage"
  />
  <p>downloadSpeed: {{ downloadSpeed }}</p>
  <p>Original: {{ downloadText }}</p>
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
  download_speed?: string
  estimated_time?: string
  total_bytes?: string
  total_bytes_estimate?: string
  downloaded_bytes?: string
  elapsed_time?: string
  default_template?: string
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

const downloadPercentage = ref<number>()
const downloadSpeed = ref<string>('')
const downloadText = ref<string>('')
const urlText = ref<String>('')
const urlList = ref<String[]>([])
const filePath = ref<String>('')
const errorMessage = ref<String>('')
const urlBoxRef = ref()

const sendMessage = () => {
  console.log('sendMessage')
}
const connectMe = () => {
  console.log('connectMe')

  socket.connect()
}
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
  downloadPercentage.value = downloadInfo.percentage
  downloadSpeed.value = downloadInfo.download_speed || ''
  downloadText.value = downloadInfo.default_template || ''
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

onMounted(() => {
  urlBoxRef.value.focus()
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
