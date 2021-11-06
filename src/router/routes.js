
const routes = [
  {
    path: '/start',
    // redirect: 'https://slack.com/openid/connect/authorize?scope=openid%20profile&amp;response_type=code&amp;redirect_uri=https%3A%2F%2Flocalhost/slacklogin&amp;client_id=2696943977700.2696948669268'
    component: () => import('components/slack_login/SlackLoginWindow.vue')
  },
  {
    path: '/slacklogin',
    // redirect: 'https://slack.com/openid/connect/authorize?scope=openid%20profile&amp;response_type=code&amp;redirect_uri=https%3A%2F%2Flocalhost/slacklogin&amp;client_id=2696943977700.2696948669268'
    redirect: '/pow'
  },
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
