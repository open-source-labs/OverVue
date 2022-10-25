<template>
  <q-btn class="menu-btn" color="purple" no-caps @click="openLogin">
    <!-- Slack logo -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style="height: 20px; width: 20px; margin-right: 12px"
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
    Slack Login
  </q-btn>
  <div>
    <q-dialog
      v-model="showLogin"
      persistent
      border-rounded
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card class="slackLogin" border-rounded>
        <q-card-section class="q-pt-none slackLogin">
          <q-btn @click="slackOauth" id="slackButton">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style="height: 20px; width: 20px; margin-right: 12px"
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
          <div id="slackErrorMsg">{{ errorMessage }}</div>
          <button @click="closeLogin()" id="skipButton">Skip</button>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import localforage from "localforage";
import { useStore } from "../../store/main";
import { ref } from "vue";
const { ipcRenderer, shell } = window;

const store = useStore();
let isAuthenticating = ref(false);
let showLogin = ref(false);
const errorMessage = ref("");

ipcRenderer.on(
  "tokenReceived",
  (event: Event, data: { incoming_webhook: { url: string } }) => {
    return saveToLocalForage("slackWebhookURL", data.incoming_webhook.url);
  }
);
ipcRenderer.on("slackUser", (event: Event, user: string) => {
  return saveToLocalForage("slackUser", user);
});
ipcRenderer.on("slackError", (event: Event, err: Error) => {
  printErrorMessage();
});

const slackOauth = () => {
  const slackBaseUrl = "https://slack.com/oauth/v2/authorize";
  // const responseType = 'code'
  const scope = "incoming-webhook";
  const redirectUri = process.env.SLACK_REDIRECT_URI;
  const clientId = process.env.SLACK_CLIENT_ID;
  isAuthenticating.value = true;

  if (redirectUri && clientId) {
    const trimmedUri = redirectUri.slice(1, redirectUri.length - 1);
    const trimmedClientId = clientId.slice(1, clientId.length - 1);

    shell.openExternal(
      `${slackBaseUrl}?scope=${scope}&redirect_uri=${trimmedUri}&client_id=${trimmedClientId}`,
      { activate: true }
    );
  }
};

const saveToLocalForage = (key: string, value: string) => {
  localforage.setItem(key, value);
  closeLogin();
};

const printErrorMessage = () => {
  errorMessage.value = "Failed to Connect to Slack";
};

const setErrorMessage = (err: string) => {
  errorMessage.value = err;
};

const closeLogin = () => {
  showLogin.value = false;
  errorMessage.value = "";
};

const openLogin = () => {
  showLogin.value = true;
};
</script>

<!-- old options api script -->
<!-- <script>
import localforage from "localforage";
const { ipcRenderer, shell } = window;

export default {
  name: "SlackLoginWindow",
  data() {
    return {
      isAuthenticating: false,
      showLogin: false,
      errorMessage: "",
    };
  },
  created() {
    ipcRenderer.on("tokenReceived", (event, data) => {
      return this.saveToLocalForage(
        "slackWebhookURL",
        data.incoming_webhook.url
      );
    });
    ipcRenderer.on("slackUser", (event, user) => {
      return this.saveToLocalForage("slackUser", user);
    });
    ipcRenderer.on("slackError", (event, err) => {
      this.printErrorMessage();
    });
  },
  methods: {
    slackOauth: function () {
      const slackBaseUrl = "https://slack.com/oauth/v2/authorize";
      // const responseType = 'code'
      const scope = "incoming-webhook";
      const redirectUri = process.env.SLACK_REDIRECT_URI;
      const clientId = process.env.SLACK_CLIENT_ID;

      this.isAuthenticating = true;

      const trimmedUri = redirectUri.slice(1, redirectUri.length - 1);
      const trimmedClientId = clientId.slice(1, clientId.length - 1);

      shell.openExternal(
        `${slackBaseUrl}?scope=${scope}&redirect_uri=${trimmedUri}&client_id=${trimmedClientId}`,
        { activate: true }
      );
    },
    saveToLocalForage: function (key, value) {
      localforage.setItem(key, value);
      this.closeLogin();
    },
    printErrorMessage: function () {
      this.errorMessage = "Failed to Connect to Slack";
    },
    setErrorMessage: function (err) {
      this.errorMessage = err;
    },
    closeLogin: function () {
      console.log(this.showLogin, "this is showlogin")
      this.showLogin = false;
      this.errorMessage = "";
    },
    openLogin: function () {
      console.log(this.showLogin, "inopenlogin")
      this.showLogin = true;
    },
  },
};
</script> -->

<style lang="scss" scoped>
.slackLogin {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  background-color: $subprimary;
  padding: 30px;
}

#slackButton {
  color: $menutext;
  background-color: purple;
  margin-bottom: 10px;
  width: 100%;
}

#skipButton {
  color: $menutext;
  background-color: $subprimary;
  border: 1px solid $subprimary;
  text-decoration: underline;
  margin-top: 20px;
}

#skipButton:hover {
  cursor: pointer;
}

#slackErrorMsg {
  color: $negative;
}

.qCardColor {
  background-color: $subprimary;
  border: 1px solid $subprimary;
}
.qCardBorderColor {
  border: 1px solid $subprimary;
}
.openModalBtn {
  border: 1px solid #289ead;
}
.menu-btn {
  width: 80%;
  margin: 10px 0px;
}
</style>
