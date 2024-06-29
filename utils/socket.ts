import { reactive } from 'vue'
import { io } from 'socket.io-client'

interface SomeState {
  connected: boolean
  fooEvents: any[]
  barEvents: any[]
  theNumber: number
}

export const state = reactive<SomeState>({
  connected: false,
  fooEvents: [],
  barEvents: [],
  theNumber: 0
})

// TODO: env is needed
const URL = 'http://127.0.0.1:5000'

export const socket = io(URL)

socket.on('connect', () => {
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})

socket.on('bar', (...args) => {
  state.barEvents.push(args)
})
