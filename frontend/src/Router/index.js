import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
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
                return <Component />
              }}
            />
          ))}
          <Redirect to='/' />
        </Switch>
  )
}

export default Index