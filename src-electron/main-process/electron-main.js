import { app, BrowserWindow, net } from "electron";
import { Deeplink } from "electron-deeplink";
import isDev from "electron-is-dev";
import jwt_decode from 'jwt-decode';

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require("path")
    .join(__dirname, "statics")
    .replace(/\\/g, "\\\\");
}

function logEverywhere(toBeLogged) {
  if (isDev) {
    console.log(toBeLogged);
  } else {
    console.log(toBeLogged);
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.executeJavaScript(
        'console.log("' + toBeLogged + '" )'
      );
    }
  }
}

let mainWindow;
let authCode;
const protocol = isDev ? "overvuedev" : "overvue";

// Used to console log for main process in production mode

const deeplink = new Deeplink({
  app,
  mainWindow,
  protocol,
  isDev,
  debugLogging: true,
  electronPath: '/node_modules/electron/dist/electron.exe'
});
// logEverywhere(`electron path:  ${require('path').join(__dirname, '../../node_modules/electron/dist/electron.exe')}`);
// Sends request to Slack for User's information,
// then sends user information back to renderer process
function slackErrorHandler(err) {
  return mainWindow.webContents.send('slackError', err)
}

function sendTokenRequest() {
  // logEverywhere("inside sendTokenRequest");

  // Send Post request for user information
  const request = net.request({
    method: "POST",
    url: 'https://slack.com/api/oauth.v2.access?' +
      "client_id=" +
      process.env.SLACK_CLIENT_ID +
      "&client_secret=" +
      process.env.SLACK_CLIENT_SECRET +
      "&code=" +
      authCode +
      "&grant_type=authorization_code" +
      "&redirect_uri=" +
      process.env.SLACK_REDIRECT_URI,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  // Listens for response from token request
  request.on("response", response => {
    // logEverywhere("request.on response received");
    response.on("end", () => {
      // logEverywhere("Response ended ");
    });
    response.on("data", data => {
      const decoded = JSON.parse(data.toString())
      if (decoded.error) {
        return slackErrorHandler(decoded.error)
      }
      // console.log('Is there an error? ', !!decoded.error, 'if true, this shouldnt be logging')
      mainWindow.webContents.send("tokenReceived", decoded);
      // getSlackUser(decoded.access_token, decoded.authed_user.id)
    });
  });
  request.end();
}

function getSlackUser (token, userId) {
  const request = net.request({
    method: 'POST',
    url: 'https://slack.com/api/users.profile.get?' +
    "token=" + token +
    "&user=" + userId,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  request.on('response', response => {
    response.on('end', () => {
      // logEverywhere('User data recieved')
    })
    response.on('data', data => {
      const decoded = JSON.parse(data.toString());
      if (decoded.error) {
        return slackErrorHandler(decoded.error)
      }
      // logEverywhere('slackUser decoded data in getSlackUser' + decoded)
      mainWindow.webContents.send('slackUser', decoded)
    })
  })
  request.end()
}

/*
For Sign In with Slack, but we are now using the Add to Slack feature instead
*/
// function decodeUserToken (data) {
//   // logEverywhere("response.on data ");
//   // decodes utf8 Buffer into JSON, then parses it
//   const decoded = JSON.parse(data.toString())
//   // decodes JSON Web Token and places decoded JWT back into response data
//   decoded.id_token = jwt_decode(decoded.id_token)
//   // logEverywhere(`decoded in response.on data: ${decoded}`)
//   // send user information back to renderer process
//   return mainWindow.webContents.send("tokenReceived", decoded);
// }

// Turns on event listener for Slack Oauth deep linking back app
// TODO: Deep linking currently doesn't work properly in dev mode on windows - requires fix

function setOauthListener() {
  // logEverywhere(`process.env.SLACK_CLIENT_ID in electron-main:  ${process.env.SLACK_CLIENT_ID}`);
  // logEverywhere(`process.env.SLACK_CLIENT_SECRET in electron-main:  ${process.env.SLACK_CLIENT_SECRET}`);

  return deeplink.on("received", link => {
    // logEverywhere(`auth worked here link: ${link}`);
    // Extracts Slack authorization code from deep link
    authCode = link.split("=")[1];
    sendTokenRequest();
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

  // logEverywhere(`Current deeplink Protocol: ${deeplink.getProtocol()}`);
  // logEverywhere(`process.execPath: ${process.execPath}`);
  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();
  setOauthListener();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
    setOauthListener();
  }
});
