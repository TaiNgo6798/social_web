import React from 'react'
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { routers } from '../configs'


function Index() {
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