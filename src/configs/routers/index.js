
export const routers = [
  {
    exact: true,
    path: '/admin',
    component: 'admin'
  },
  {
    exact: true,
    path: '/login',
    component: 'login'
  },
  {
    exact: true,
    path: '/',
    component: 'login'
  },
  {
    exact: true,
    path: '/newsFeed',
    component: 'newsFeed'
  },
  {
    exact: true,
    path: '/profile/:userID',
    component: 'profile'
  },
]
