<!--<template v-if="show">-->
<template>
  <div>
    <div>
      <q-btn class ="openModalBtn" @click="openLogin" >
        <svg xmlns="http://www.w3.org/2000/svg" style="height:18px;width:18px;margin-right:0" viewBox="0 0 122.8 122.8">
          <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path>
          <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path>
          <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path>
          <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path>
        </svg>
      </q-btn>
    </div>
    <q-dialog v-model="showLogin" position="top" persistent>
      <q-card class="slack-login">
      <!--
      Slack Login Button:
      -->
        <q-btn @click="slackOauth" class="slackBtn" >

          <svg xmlns="http://www.w3.org/2000/svg" style="height:20px;width:20px;margin-right:12px" viewBox="0 0 122.8 122.8">
            <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path>
            <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path>
            <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path>
            <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path>
          </svg>Connect to Slack
        </q-btn>
        <!--
        Skip button:
        -->
        <br/>
          <div style='color:red'>{{errorMessage}}</div>
        <br/>
        <q-btn @click="closeLogin()" class="skipBtn" >Skip</q-btn>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// import { mapState, mapActions } from 'vuex'
import localforage from 'localforage'
import { shell, ipcRenderer } from 'electron'

/**
 * ! Important: Slack Login currently doesn't work properly in Dev Mode.  Will require a fix
 * * The deeplinking doesn't work properly unless in production mode.  To specifically test Slack Oauth feature,
 * * you must build out a production app.  To ease this process, in the quasar webpack, change the electron bundler
 * * option from 'builder' to 'packager'
 * ! For WSL users: Aside from WSL issues mentioned in README.md, you will also need to allow the deeplinking to open
 * ! the default browser in your Windows environment, since your WSL Linux environment doesn't have one
 */

export default {
  name: 'SlackLoginWindow',
  data () {
    return {
      isAuthenticating: false,
      showLogin: true,
      errorMessage: ''
    }
  },
  created () {
    ipcRenderer.on('tokenReceived', (event, data) => {
      console.log('data in SlackLoginWindow: ', data)
      // localforage.setItem('slackWebhookURL', data.incoming_webhook.url)
      //   .then(data => this.closeLogin())
      return this.saveToLocalForage('slackWebhookURL', data.incoming_webhook.url)
    })
    ipcRenderer.on('slackUser', (event, user) => {
      console.log('user received in SlackLoginWindow: ', user)
      // localforage.setItem('slackUser', user)
      //   .then(data => this.closeLogin())
      //   .catch(err => {
      //     console.log('localforage caught an error when trying to set slackUser: ', err)
      //     this.errorMessage = err
      //   })
      return this.saveToLocalForage('slackUser', user)
    })
    ipcRenderer.on('slackError', (event, err) => {
      console.log('err received in SlackLoginWindow: ', err)
      this.printErrorMessage()
    })
    console.log(`process.env: ${process.env}`)
  },
  methods: {
    slackOauth: function () {
      const slackBaseUrl = 'https://slack.com/oauth/v2/authorize'
      // const responseType = 'code'
      const scope = 'incoming-webhook'
      const redirectUri = process.env.SLACK_REDIRECT_URI
      const clientId = process.env.SLACK_CLIENT_ID

      this.isAuthenticating = true;

      console.log('clicked')
      shell.openExternal(
        // `${slackBaseUrl}?response_type=${responseType}&scope=${scope}&client_id=${clientId}&redirect_uri=${redirectUri}`,
        `${slackBaseUrl}?scope=${scope}&redirect_uri=${redirectUri}&client_id=${clientId}`,
        { activate: true }
      )
    },
    saveToLocalForage: function (key, value) {
      localforage.setItem(key, value)
      this.closeLogin()
      // .catch(function (err) {
      //   console.log('localforage caught an error when trying to set slackUser: ', err)
      //   this.setErrorMessage(err)
      // })
    },
    printErrorMessage: function () {
      this.errorMessage = 'Failed to Connect to Slack'
    },
    setErrorMessage: function (err) {
      this.errorMessage = err
    },
    closeLogin: function () {
      this.showLogin = false
      this.errorMessage = ''
    },
    openLogin: function () {
      this.showLogin = true
    }
  }
}
</script>

<style>

.slack-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3em;
}

.slackBtn {
  align-items:center;
  color:#fff;
  background-color:#4A154B;
  border:0;
  border-radius:48px;
  display:inline-flex;
  font-family:Lato, sans-serif;
  font-size:16px;
  font-weight:600;
  height:48px;
  justify-content:center;
  text-decoration:none;
  width:256px;
  margin: auto;
}

.skipBtn {
  align-items:center;
  color:#000;
  display:inline-flex;
  font-family:Lato, sans-serif;
  font-size:14px;
  font-weight:600;
  height:36px;
  width:128px;
  text-decoration:none;
  justify-content:center;
  margin: auto;
}

.openModalBtn {
  display:inline-flex;
  align-items:center;
  color:#000;
  background-color:#fff;
  border:1px solid #ddd;
  border-radius:36px;
  font-family:Lato, sans-serif;
  font-size:14px;
  font-weight:600;
  height:36px;
  justify-content:center;
  text-decoration:none;
  width:36px;
}

</style>
