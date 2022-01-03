<!--<template v-if="show">-->
<template>
  <div>
    <div>
      <q-btn class="glossy bg-black openModalBtn" size="5px" @click="openLogin">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style="height:18px;width:18px;margin-right:0"
          viewBox="0 0 122.8 122.8"
        >
          <path
            d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
            fill="#e01e5a"
          ></path>
          <path
            d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
            fill="#36c5f0"
          ></path>
          <path
            d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
            fill="#2eb67d"
          ></path>
          <path
            d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
            fill="#ecb22e"
          ></path>
        </svg>
      </q-btn>
    </div>

    <!--
      Slack Login Button:
      -->

    <!--
        Skip button:
        -->
    <q-dialog
      v-model="showLogin"
      persistent
      border-rounded
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card class="qCardBorderColor bg-white text-white" border-rounded>
        <q-bar class="qCardColor">
          <i class="fas fa-sign-in-alt"></i>
          <div>Login</div>

          <q-space />
        </q-bar>

        <q-card-section class="bg-black q-pt-none">
          <div class="q-pa-md q-gutter-sm">
            <q-btn @click="slackOauth" color="purple">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style="height:20px;width:20px;margin-right:12px"
                viewBox="0 0 122.8 122.8"
              >
                <path
                  d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
                  fill="#e01e5a"
                ></path>
                <path
                  d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
                  fill="#36c5f0"
                ></path>
                <path
                  d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
                  fill="#2eb67d"
                ></path>
                <path
                  d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
                  fill="#ecb22e"
                ></path>
              </svg>
              Connect to Slack
            </q-btn>
          </div>
          <div style="color:red">{{ errorMessage }}</div>
          <div class="skipLogin q-pa-md q-gutter-sm">
            <q-btn @click="closeLogin()" color="white" text-color="black">Skip</q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// import { mapState, mapActions } from 'vuex'
import localforage from "localforage";
// import { shell, ipcRenderer } from "electron";
const { ipcRenderer, shell } = window;

export default {
  name: "SlackLoginWindow",
  data() {
    return {
      isAuthenticating: false,
      showLogin: true,
      errorMessage: ""
    };
  },
  created() {
    ipcRenderer.on("tokenReceived", (event, data) => {
      // console.log("data in SlackLoginWindow: ", data);
      // localforage.setItem('slackWebhookURL', data.incoming_webhook.url)
      //   .then(data => this.closeLogin())
      return this.saveToLocalForage(
        "slackWebhookURL",
        data.incoming_webhook.url
      );
    });
    ipcRenderer.on("slackUser", (event, user) => {
      // console.log("user received in SlackLoginWindow: ", user);
      // localforage.setItem('slackUser', user)
      //   .then(data => this.closeLogin())
      //   .catch(err => {
      //     console.log('localforage caught an error when trying to set slackUser: ', err)
      //     this.errorMessage = err
      //   })
      return this.saveToLocalForage("slackUser", user);
    });
    ipcRenderer.on("slackError", (event, err) => {
      // console.log("err received in SlackLoginWindow: ", err);
      this.printErrorMessage();
    });
    // console.log(`process.env: ${process.env}`);
  },
  methods: {
    slackOauth: function() {
      const slackBaseUrl = "https://slack.com/oauth/v2/authorize";
      // const responseType = 'code'
      const scope = "incoming-webhook";
      const redirectUri = process.env.SLACK_REDIRECT_URI;
      const clientId = process.env.SLACK_CLIENT_ID;

      this.isAuthenticating = true;
      
      // Tests
      // console.log(`${slackBaseUrl}?scope=${scope}&redirect_uri=${redirectUri}&client_id=${clientId}`)
      // console.log(redirectUri.slice(1, redirectUri.length - 1))
      const trimmedUri = redirectUri.slice(1, redirectUri.length - 1);
      const trimmedClientId = clientId.slice(1, clientId.length - 1);

      // console.log("clicked");
      // **************** ok
      // shell.openExternal(
      //   // `${slackBaseUrl}?response_type=${responseType}&scope=${scope}&client_id=${clientId}&redirect_uri=${redirectUri}`,
      //   `${slackBaseUrl}?scope=${scope}&redirect_uri=${redirectUri}&client_id=${clientId}`,
      //   { activate: true }
      // );
      // ****************** test
      shell.openExternal(
        // `${slackBaseUrl}?response_type=${responseType}&scope=${scope}&client_id=${clientId}&redirect_uri=${redirectUri}`,
        `${slackBaseUrl}?scope=${scope}&redirect_uri=${trimmedUri}&client_id=${trimmedClientId}`,
        { activate: true }
      );
    },
    saveToLocalForage: function(key, value) {
      localforage.setItem(key, value);
      this.closeLogin();
      // .catch(function (err) {
      //   console.log('localforage caught an error when trying to set slackUser: ', err)
      //   this.setErrorMessage(err)
      // })
    },
    printErrorMessage: function() {
      this.errorMessage = "Failed to Connect to Slack";
    },
    setErrorMessage: function(err) {
      this.errorMessage = err;
    },
    closeLogin: function() {
      this.showLogin = false;
      this.errorMessage = "";
    },
    openLogin: function() {
      this.showLogin = true;
    }
  }
};
</script>

<style>
.slack-login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.skipBtn {
  color: #000;
  font-family: Lato, sans-serif;
  font-size: 14px;
  font-weight: 600;
  height: 36px;
  width: 128px;
  text-decoration: none;
}

.skipLogin {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.xBtn {
  justify-content: flex-end;
  align-items: center;
}

.qCardColor {
  background-color: #202122;
  border: 1px solid #202122;
}
.qCardBorderColor {
  border: 1px solid #202122;
}
.openModalBtn {
  border: 1px solid #289ead;
}
</style>
