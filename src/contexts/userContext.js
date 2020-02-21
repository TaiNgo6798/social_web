import React, { useState, createContext, useEffect } from 'react'
import jwt, { decode } from 'jsonwebtoken'


export const UserContext = createContext()


function Index(props) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    console.log('useEffect ran !')
    setUser(decodeToken())
  }, [])

  const refreshUser = () => {
    console.log('user refreshed !')
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
    <UserContext.Provider value={{user, setUser, refreshUser}}>
      {props.children}
    </UserContext.Provider>
  )
}

export default Index