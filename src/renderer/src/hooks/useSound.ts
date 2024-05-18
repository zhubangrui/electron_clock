import { useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useSound = (src: string) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null)
  const [gainNode, setGainNode] = useState<GainNode | null>(null)
  useEffect(() => {
    const context = new window.AudioContext()
    setAudioContext(context)
    const source = context.createBufferSource()
    setAudioSource(source)
    const gain = context.createGain()
    setGainNode(gain)

    return (): void => {
      context.close()
    }
  }, [])

  const playSound = async (): Promise<void> => {
    if (!isPlaying && audioContext && gainNode) {
      const source = audioContext.createBufferSource()
      setAudioSource(source)

      const response = await fetch(src)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      source.buffer = audioBuffer
      source.connect(gainNode)
      gainNode.connect(audioContext.destination)
      source.loop = true
      source.start()
      setIsPlaying(true)
    }
  }

  const stopSound = (): void => {
    if (isPlaying && audioSource) {
      audioSource.stop()
      setIsPlaying(false)
    }
  }

  return { playSound, stopSound }
}
