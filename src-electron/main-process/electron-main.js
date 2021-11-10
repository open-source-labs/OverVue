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
let authResponse;

function logEverywhere(...toBeLogged) {
  console.log(...toBeLogged);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`console.log("${toBeLogged}")`);
  }
}

const protocol = isDev ? "dev-app" : "prod-app";
const deeplink = new Deeplink({ app, mainWindow, protocol, isDev });
// ipcMain.handle('slackAuth', slackAuth)

function getSlackAuth () {
  const authData = {
    client_id: clientId,
    client_secret: clientSecret,
    code: authCode,
    redirect_uri: 'overvue://slack'
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
//overvue://slack/?code=2696943977700.2730026875664.c754c0f5326f5c8495cd66fb374c5ea441c610b2cff0064dd4832b0290db6b5b

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
