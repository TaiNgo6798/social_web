import React, { Suspense, useContext, useEffect } from 'react'
import './App.css'
import AppRouters from './Router'

import NavBar from './components/nav'
import Chatbar from './components/chatBar'

import { UserContext } from './contexts/userContext'

import {
  withRouter
} from 'react-router-dom'

const App = (props) => {

  useEffect(() => {
    let mounted = true
    if (mounted) {
      props.history.listen((location, action) => {
        refreshCurrentUrl(location.pathname)
      })
    }
    return () => { mounted = false }
  }, [])

  const exceptRoute = ['/', '/login', ''] // cac route khong hien thanh chat va thanh NAV
  const { currentUrl, refreshCurrentUrl } = useContext(UserContext)
  return (
    <>
      {
        exceptRoute.indexOf(currentUrl) === -1 ?
          <>
            <NavBar />
            <Chatbar />
          </>
          : <></>
      }
      <Suspense fallback={<div>Loading...</div>}>
        <AppRouters />
      </Suspense>
    </>
  )
}

export default withRouter(App)
