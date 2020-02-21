import React, { Suspense } from 'react'
import './App.css'
import AppRouters from './Router'

import Login from '../src/pages/login'

import {
  BrowserRouter as Router
} from 'react-router-dom'

const App = (props) => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <AppRouters />
        </Router>
      </Suspense>
    </>
  )
}

export default App
