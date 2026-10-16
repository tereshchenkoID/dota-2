import { AUDIO_CONFIG } from '@/modules/Dota/config/audio'
let context
let generation = 0
let hitIndex = 0
const buffers = new Map()
const activeSources = new Set()

function getContext() {
  if (!context) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    context = new AudioContext()
  }
  return context
}

function loadClip(path) {
  if (!buffers.has(path)) {
    buffers.set(
      path,
      fetch(path)
        .then((response) => {
          if (!response.ok) throw new Error('Audio unavailable')
          return response.arrayBuffer()
        })
        .then((data) => getContext().decodeAudioData(data))
        .catch(() => {
          buffers.delete(path)
          return null
        }),
    )
  }
  return buffers.get(path)
}

export function unlockAudio() {
  try {
    const ctx = getContext()
    if (!ctx) return
    void ctx.resume().catch(() => {})
    Object.values(AUDIO_CONFIG)
      .flat()
      .forEach((path) => {
        void loadClip(path)
      })
  } catch {
    /* Audio is optional on unsupported browsers. */
  }
}

async function playClip(path, volume, delay = 0, maxDuration = 2) {
  const token = generation
  try {
    const ctx = getContext()
    if (!ctx) return
    const buffer = await loadClip(path)
    if (!buffer || token !== generation || ctx.state !== 'running') return
    const source = ctx.createBufferSource()
    const gain = ctx.createGain()
    source.buffer = buffer
    const duration = Math.min(buffer.duration, maxDuration)
    const start = ctx.currentTime + delay
    gain.gain.setValueAtTime(volume, start)
    gain.gain.setValueAtTime(volume, start + Math.max(0, duration - 0.07))
    gain.gain.linearRampToValueAtTime(0, start + duration)
    source.connect(gain)
    gain.connect(ctx.destination)
    activeSources.add(source)
    source.onended = () => {
      activeSources.delete(source)
      source.disconnect()
      gain.disconnect()
    }
    source.start(start, 0, duration)
  } catch {
    /* Missing optional audio never interrupts a battle. */
  }
}

export function stopSounds() {
  generation++
  for (const source of activeSources) {
    try {
      source.stop()
    } catch {
      /* Already stopped. */
    }
  }
  activeSources.clear()
}

export function playSound(kind) {
  if (kind === 'hit') {
    const index = hitIndex++
    void playClip(AUDIO_CONFIG.impact[index % AUDIO_CONFIG.impact.length], 0.55)
    void playClip(
      AUDIO_CONFIG.roshan[index % AUDIO_CONFIG.roshan.length],
      0.65,
      0.08,
      1.8,
    )
    return
  }
  if (kind === 'heal') {
    void playClip(AUDIO_CONFIG.heal, 0.4)
    return
  }
  if (kind === 'boss-attack') {
    void playClip(AUDIO_CONFIG.attack, 0.45, 0.22, 1.2)
    return
  }
  try {
    const ctx = getContext()
    if (!ctx || ctx.state !== 'running') return
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(
      kind === 'spin' ? 180 : 430,
      ctx.currentTime,
    )
    oscillator.frequency.exponentialRampToValueAtTime(
      kind === 'spin' ? 360 : 240,
      ctx.currentTime + 0.08,
    )
    gain.gain.setValueAtTime(0.025, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    oscillator.onended = () => {
      oscillator.disconnect()
      gain.disconnect()
    }
    oscillator.start()
    oscillator.stop(ctx.currentTime + 0.11)
  } catch {
    /* Sound is optional. */
  }
}
