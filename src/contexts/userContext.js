import React, { useState, createContext, useEffect } from 'react'
import jwt from 'jsonwebtoken'


export const UserContext = createContext()


function Index(props) {
  const [user, setUser] = useState(null)
  const [currentUrl, setCurrentURL] = useState('')
  const [isLoad, setIsLoad] = useState(false)

  useEffect(() => {
    let mounted = true
    if(mounted) {
      setCurrentURL(window.location.pathname)
      setUser(decodeToken())
    }
    return () => {mounted = false}
  }, [])

  const refreshCurrentUrl = (url) => { // cap nhat lai url hien tai khi chuyen route
    setCurrentURL(url)
  }

  const refreshUser = () => { // check lai user hien tai tu token
    setUser(decodeToken())
  }


  const decodeToken =  () => {
    try {
      const token = localStorage.getItem('Authorization').split(' ')[1]
      const user =  jwt.verify(token, 'taingo6798')
      return user
    } catch (error) {
      return null
    }
  }

  const contextValue = {
    user,
    setUser,
    refreshUser,
    currentUrl,
    refreshCurrentUrl,
    decodeToken,
    isLoad,
    setIsLoad
  }

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  )
}

export default Index