
const routes = [
  {
    path: '/vgnfd',
    // redirect: ''
    component: () => import('components/slack_login/SlackLoginWindow.vue')
  },
  {
    path: '/slacklogin',
    // redirect: ''
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
