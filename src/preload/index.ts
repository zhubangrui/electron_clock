// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

export type Channels = ''

const electronHandler = {
  ipcRenderer: {
    send(channel: Channels, ...args: unknown[]): void {
      ipcRenderer.send(channel, ...args)
    },

    on(channel: Channels, func: (...args: unknown[]) => void): () => Electron.IpcRenderer {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]): void => func(...args)
      ipcRenderer.on(channel, subscription)

      return (): Electron.IpcRenderer => ipcRenderer.removeListener(channel, subscription)
    },

    invoke(channel: Channels, ...args: unknown[]): Promise<Electron.IpcRenderer> {
      return ipcRenderer.invoke(channel, ...args)
    },

    once(channel: Channels, func: (...args: unknown[]) => void): void {
      ipcRenderer.once(channel, (_event, ...args) => func(...args))
    }
  }
}

contextBridge.exposeInMainWorld('electron', electronHandler)

export type ElectronHandler = typeof electronHandler
