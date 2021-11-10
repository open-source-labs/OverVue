<template>
<div>
<!--
Slack Login Button:
-->
<q-btn @click="slackOauth" class="slackBtn" >

  <svg xmlns="http://www.w3.org/2000/svg" style="height:20px;width:20px;margin-right:12px" viewBox="0 0 122.8 122.8">
    <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path>
    <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path>
    <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path>
    <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path>
  </svg>Sign in with Slack
</q-btn>
<!--
Skip button:
-->
<br/>
<q-btn @click="skipToHomePage" class="skipBtn" >Skip</q-btn>
</div>

</template>

<script>
// import { mapState, mapActions } from 'vuex'
import localforage from 'localforage'
import { shell, ipcRenderer } from 'electron'
import slackApiStuff from '../../../secretStuff/slackApiStuff.js'


export default {
  name: 'SlackLoginWindow',
  data () {
    return {
      oauthURL: slackApiStuff.oauthURL,
      isAuthenticating: false
    }
  },
  created () {
    ipcRenderer.once('tokenReceived', (data) => {
      console.log('data received in SlackLoginWindow: ', data)
    })
  },
  methods: {
    slackOauth: function () {
      const slackBaseUrl = 'https://slack.com/openid/connect/authorize'
      const responseType = 'code'
      const scope = 'openid profile'
      const clientId = slackApiStuff.clientId
      const redirectUri = process.env.DEV ? 'https://localhost:8080' : 'overvue://slack'

      this.isAuthenticating = true;

      console.log('clicked')
      // shell.openExternal(this.oauthURL)
      // window.open(this.oauthURL, '_blank')
      shell.openExternal(
        `${slackBaseUrl}?response_type=${responseType}&scope=${scope}&client_id=${clientId}&redirect_uri=${redirectUri}`,
        { activate: true }
      )
      // .then(data => console.log(data))
      // .then(data => )
    },
    skipToHomePage: function () {
      console.log('CLICKK')
      console.log('process.env: ', process.env)
      console.log('process.platform: ', process.platform)
    }
  }
}
</script>

<style>

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
}

</style>
