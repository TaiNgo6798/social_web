import React from 'react'
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { routers } from '../configs'
import NavBar from '../components/nav'
import Chatbar from '../components/chatBar'

function Index() {
  const unCommonRoutes = ['/login', '/admin', '/'] // các route không cho hiện Nav và ChatBar
  return (
    <Switch>
      {routers.map((route, idx) => (
        <Route
          key={idx}
          exact={route.exact}
          path={route.path}
          render={() => {
            const Component = React.lazy(() => import(`../pages/${route.component}`))
            return <>
              {
                unCommonRoutes.indexOf(route.path) !== -1 ||
                (<>
                  <NavBar />
                  <Chatbar />
                </>)
              }
              {
                route.path === '/newsFeed' &&
                  (!localStorage.getItem('Authorization')) ?
                  <Redirect to='/login' /> :
                  <Component />
              }
            </>
          }}
        />
      ))}
      <Redirect to='/' />
    </Switch>
  )
}

export default Index