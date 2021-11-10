import { app, BrowserWindow, net, shell, ipcMain } from "electron";
import { Deeplink } from "electron-deeplink";
import isDev from "electron-is-dev";

import slackApiStuff from '../../secretStuff/slackApiStuff'

const clientId = slackApiStuff.clientId
const clientSecret = slackApiStuff.clientSecret

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require("path")
    .join(__dirname, "statics")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
let authCode;

function logEverywhere(...toBeLogged) {
  console.log(...toBeLogged);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`console.log("${toBeLogged}")`);
  }
}

const protocol = isDev ? 'overvuedev' : 'overvue'
const deeplink = new Deeplink({
  app,
  mainWindow,
  protocol,
  isDev ,
  debugLogging: true,
  electronPath: '../../node_modules/electron/dist/electron.exe'
});
// ipcMain.handle('slackAuth', slackAuth)

let deeplinkingUrl;

function customDeepLink() {
  if (isDev && process.platform === 'win32') {
    // Set the path of electron.exe and your app.
    // These two additional parameters are only available on windows.
    // Setting this is required to get this working in dev mode.
    app.setAsDefaultProtocolClient('overvuedev', process.execPath, [
      resolve(process.argv[1])
    ]);
  } else {
    app.setAsDefaultProtocolClient('overvue');
  }

  app.on('open-url', function (event, url) {
    event.preventDefault();
    deeplinkingUrl = url;
  });

  // Force single application instance
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
    return;
  } else {
    app.on('second-instance', (e, argv) => {
      if (process.platform !== 'darwin') {
        // Find the arg that is our custom protocol url and store it
        deeplinkingUrl = argv.find((arg) => arg.startsWith('overvuedev://test'));
      }

      if (myWindow) {
        if (myWindow.isMinimized()) myWindow.restore();
        myWindow.focus();
      }
    })
  }
}


function getSlackAuth () {
  const authData = {
    client_id: clientId,
    client_secret: clientSecret,
    code: authCode,
    redirect_uri: isDev ? 'overvuedev://test' : 'overvue://slack'
  }

  const request = net.request({
    method: 'POST',
    url: 'https://slack.com/api/openid.connect.token?' +
      'client_id=' + authData.client_id +
      '&client_secret=' + authData.client_secret +
      '&code=' + authData.authCode +
      '&redirect_uri=' + authData.redirect_uri,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // 'Content-Length': authData.length
    }
  })

  request.on('response', (response) => {
    logEverywhere('RESPONSE RECEIVED SON')
    JSON.parse(response)
      .then(data => {
        logEverywhere('response with token: ')
        logEverywhere(response)
        mainWindow.webContents.send('tokenReceived', response)
      })
  })
  request.end()
}

function getSlackToken () {
  return deeplink.on("received", link => {
    logEverywhere('auth worked here link: ', link)
    authCode = link.split('=')[1]
    getSlackAuth()
  });
}

function createWindow() {
  /**
   * Initial window options
   */

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });

  logEverywhere('current protocol ', deeplink.getProtocol())
  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow()
  getSlackToken()
  logEverywhere("process.env: ", process.env)
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})
