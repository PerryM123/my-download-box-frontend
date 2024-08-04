<template>
  <h1>My Download Box</h1>
  <div>
    <p
      class="connectionStatus"
      :class="
        socketState.connected
          ? 'connectionStatus--success'
          : 'connectionStatus--failure'
      "
    >
      {{ socketState.connected ? 'Connected!👍' : 'Not Connected...👎' }}
    </p>
  </div>
  <div class="connectButtons">
    <button class="buttonItem" @click="connectMe">Connect</button>
    <button class="buttonItem" @click="disconnectMe">Disconnect</button>
  </div>

  <div class="urlToAdd">
    <p>The Url To Add</p>
    <div>
      <div class="errorArea">
        <p class="errorItem" v-if="isUrlAlreadyInList">
          This entry is already in Download List!
        </p>
        <p class="errorItem" v-if="isUrlEntryEmpty">URL Input is empty!</p>
      </div>
      <input
        class="inputBox"
        type="text"
        ref="urlBoxRef"
        v-model="urlText"
        @keydown.enter="addUrl"
        @input="setToDefaultInput"
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
import { onMounted, onUnmounted, ref } from 'vue'
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
const urlText = ref<string>('')
const urlList = ref<string[]>([])
const filePath = ref<string>('')
const errorMessage = ref<string>('')
const urlBoxRef = ref()
const isUrlAlreadyInList = ref<boolean>(false)
const isUrlEntryEmpty = ref<boolean>(false)

const setToDefaultInput = () => {
  console.log('function: setToDefaultInput')
  if (isUrlEntryEmpty.value) {
    isUrlEntryEmpty.value = false
  }
  if (isUrlAlreadyInList.value) {
    isUrlAlreadyInList.value = false
  }
}
const connectMe = () => {
  console.log('connectMe')

  socket.connect()
}
const disconnectMe = () => {
  console.log('disconnectMe')
  socket.disconnect()
}
const isUrlValid = () => {
  const trimmedUrl = urlText.value.trim()
  if (trimmedUrl.length === 0 || isUrlEntryEmpty.value === true) {
    isUrlEntryEmpty.value = true
    return false
  } else if (urlList.value.some((url) => url === trimmedUrl)) {
    isUrlAlreadyInList.value = true
    return false
  }
  return true
}
const addUrl = () => {
  if (!isUrlValid()) {
    return
  }
  socket.emit('addUrl', urlText.value)
  urlText.value = ''
}
socket.on('updateUrls', (urlListFromServer: string[]) => {
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
* {
  box-sizing: border-box;
}
.urlToAdd {
  border: 1px solid;
  padding: 10px;
  margin-top: 10px;
}
.inputBox {
  border: 1px solid;
  padding: 5px;
  width: 100%;
}
.error {
  color: red;
}
.errorItem {
  border: 1px solid red;
  border-radius: 5px;
  background-color: #df0d0d1c;
  padding: 10px;
  display: inline-block;
}
.connectButtons {
  display: flex;
  gap: 5px;
}

.buttonItem {
  padding: 10px;
  width: 100px;
}

.connectionStatus {
  display: inline-block;
  padding: 15px;
  &--success {
    border: 1px solid green;
    background: #00800014;
  }
  &--failure {
    border: 1px solid red;
    background-color: rgba(223, 13, 13, 0.1098039216);
  }
}
</style>
