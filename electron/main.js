const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron') // http://electron.atom.io/docs/api
const path = require('path')
const os = require('os')

let window = null
let tray = null

// to locally test your application change the URL to http://localhost:3001 - this is where the dev version of your react app runs
const url = "https://maker-goals-menubar.herokuapp.com/"
// const url = "http://localhost:3001"

if (os.platform() == "darwin") {
  // macOS
  app.dock.hide()

  // Wait until the app is ready
  app.once('ready', () => {
    // Create a new tray
    tray = new Tray(path.join(__dirname, 'assets/makergoalsTemplate.png'))
    tray.setToolTip('Maker Goals Menubar');

    // handle clicks
    tray.on('right-click', toggleWindow);
    tray.on('double-click', toggleWindow);
    tray.on('click', toggleWindow);

    // Create a new window
    window = new BrowserWindow({
      width: 411,
      height: 610,
      show: false,
      frame: false,
      fullscreenable: false,
      webPreferences: {
        backgroundThrottling: false,
        preload: __dirname + '/preload.js',
        nodeIntegration: true
      }
    })
    window.loadURL(url)

    window.once('ready-to-show', () => {
      const position = getWindowPosition()
      window.setPosition(position.x, position.y, false)
      window.show()
      window.focus()
    })

    // Hide the window when it loses focus
    window.on('blur', () => {
      window.hide()
    })
  })
} else if (os.platform() == "win32" || os.platform() == "linux") {
  // windows
  app.on("ready", () => {
    window = new BrowserWindow({
      width: 411,
      height: 650,
      show: true,
      frame: true,
      fullscreenable: false,
      minimizable: false,
      maximizable: false,
      webPreferences: {
        backgroundThrottling: false,
        preload: __dirname + '/preload.js',
        nodeIntegration: true
      }
    })
    window.loadURL(url)

    window.once('ready-to-show', () => {
      const position = getWindowPosition()
      window.setPosition(position.x, position.y, false)
      window.show()
      window.focus()
    })

    window.setMenu(null)

    if (os.platform() == "linux") {
      window.setMenuBarVisibility(false)
      window.setMinimizable(false)
      window.setMaximizable(false)
      window.setResizable(false)
    }
  });
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return { x: x, y: y }
}

// toggle window
const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const position = getWindowPosition()
  window.setPosition(position.x, position.y, false)
  window.show()
  window.focus()
}

ipcMain.on("restartApp", (evt, arg) => {
  app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
  app.exit(0);
});

ipcMain.on("quitApp", (evt, arg) => {
  app.exit(0);
});