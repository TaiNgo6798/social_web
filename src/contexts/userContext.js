import React, { useState, createContext, useEffect } from 'react'
import jwt from 'jsonwebtoken'


export const UserContext = createContext()


function Index(props) {
  const [user, setUser] = useState(null)
  const [currentUrl, setCurrentURL] = useState('')

  useEffect(() => {
    let mounted = true
    if(mounted) {
      setCurrentURL(window.location.pathname)
      setUser(decodeToken())
    }
    return () => {mounted = false}
  }, [])

  const refreshCurrentUrl = () => {
    
    setCurrentURL(window.location.pathname)
  }

  const refreshUser = () => {
    setUser(decodeToken())
  }

  const decodeToken = () => {
    try {
      const token = localStorage.getItem('Authorization').split(' ')[1]
      const user = jwt.verify(token, 'taingo6798')
      return user
    } catch (error) {
      return null
    }
  }

  return (
    <UserContext.Provider value={{user, setUser, refreshUser, currentUrl, refreshCurrentUrl}}>
      {props.children}
    </UserContext.Provider>
  )
}

export default Index