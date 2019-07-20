// import something here
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import AWSAppSyncClient from 'aws-appsync'
import awsmobile from '../aws-exports'

const config = {
  url: awsmobile.aws_appsync_graphqlEndpoint,
  region: awsmobile.aws_appsync_region,
  auth: {
    type: awsmobile.aws_appsync_authenticationType,
    jwtToken: async () => (await Vue.prototype.$Auth.currentSession()).getIdToken().getJwtToken()
  }
}

// The default fetchPolicy is cache-first. This means that if data
// is returned from the cache, no network request will be sent. If
// a new item is in a list, this will not be realised. So here we change
// the policy so that network requests are always sent after data is returned
// from the cache.
const options = {
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    },
    connectToDevTools: true, // Remove this for production use
    disableOffline: true
  }
}

const client = new AWSAppSyncClient(config, options)
const appsyncProvider = new VueApollo({
  defaultClient: client
})

// leave the export, even if you don't use it
export default async ({
  app,
  router,
  Vue
}) => {
  // something to do
  Vue.use(VueApollo)
  app.apolloProvider = appsyncProvider
}
