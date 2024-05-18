import { app, shell, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Database } from 'sqlite3'

const dbPath = app.isPackaged
  ? join(process.resourcesPath, 'resources')
  : join(__dirname, '../../resources/')

const db = new Database(dbPath + 'data_base.db')
db.run(
  'CREATE TABLE IF NOT EXISTS color_config (id INTEGER PRIMARY KEY, font_color TEXT, bg_color TEXT) '
)
Menu.setApplicationMenu(null)
// app.disableHardwareAcceleration() // 禁用硬件加速,主要是解决实时展示当前时间时，数字有残影的问题

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 310,
    height: 420,
    show: false,
    autoHideMenuBar: true, //隐藏菜单
    resizable: false, //设置不能改变大小
    alwaysOnTop: true, //设置一直在屏幕最前面
    frame: false, //隐藏边框
    transparent: true, //设置窗口为透明
    x: 1200,
    y: 100,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
      // webgl: false // 禁用 WebGL,主要是解决实时展示当前时间时，数字有残影的问题
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev) {
    mainWindow.webContents.toggleDevTools()
  }
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

const showDialog = (msg: string): void => {
  dialog.showMessageBox({
    type: 'info',
    message: msg,
    buttons: ['确定']
  })
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  //动态改变窗口穿透区域
  ipcMain.handle('mouse_move', (enent, args) => {
    const win = BrowserWindow.fromWebContents(enent.sender)
    win?.setIgnoreMouseEvents(args)
    return args
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getData = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      db.all('select id,bg_color,font_color from color_config', (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const insertData = (bgColor: string, fontColor: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      db.run(
        'insert into color_config (bg_color,font_color)values(?,?)',
        [bgColor, fontColor],
        (err) => {
          if (err) {
            reject(err.message)
          } else {
            resolve(true)
          }
        }
      )
    })
  }
  ipcMain.handle('init_color', async (_, data) => {
    const { bgColor, fontColor } = data
    try {
      const row = await getData()
      if (row.length === 0) {
        try {
          await insertData(bgColor, fontColor)
          return { bgColor, fontColor }
        } catch (err) {
          showDialog('数据初始化异常')
          return false
        }
      } else {
        const { bg_color, font_color } = row[0]
        return { bgColor: bg_color, fontColor: font_color }
      }
    } catch (err) {
      showDialog(`${err}`)
      return false
    }
  })
  ipcMain.on('change_color', async (event, data) => {
    const { type, color } = data
    let field = ''
    if (type === 'bg_color') {
      field = 'bg_color'
    } else if (type === 'font_color') {
      field = 'font_color'
    }
    try {
      //查询数据是否存
      const row = await getData()
      if (row.length === 0) {
        showDialog('没有数据，更改失败')
      } else {
        db.run(`update color_config set ${field}=? where id = ?`, [color, 1], async (err) => {
          if (err) {
            showDialog('更改失败')
          } else {
            //再次查询，将数据返回
            const res = await getData()
            const { bg_color, font_color } = res[0]

            event.reply('get_color', { bgColor: bg_color, fontColor: font_color })
          }
        })
      }
    } catch (err) {
      showDialog(`${err}`)
    }
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) db.close()
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
