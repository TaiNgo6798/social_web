import React, { Suspense, useContext } from 'react'
import './App.css'
import AppRouters from './Router'

import Login from '../src/pages/login'
import NavBar from './components/nav'
import Chatbar from './components/chatBar'

import { UserContext } from './contexts/userContext'

import {
  BrowserRouter as Router
} from 'react-router-dom'

const App = (props) => {
  const exceptRoute = ['/', '/login']
  const { currentUrl, refreshCurrentUrl } = useContext(UserContext)
  return (
    <>
      <Router>
        {
          exceptRoute.indexOf(currentUrl) !== -1 ||
          <>
            <NavBar />
            <Chatbar />
          </>
        }
        <Suspense fallback={<div>Loading...</div>}>
          <AppRouters />
        </Suspense>
      </Router>
    </>
  )
}

export default App
