import React, { useState, createContext, useEffect } from 'react'

export const PostContext = createContext()


function Index(props) {
  const [addPostData, setAddPostData] = useState(null)

  const contextValue = {
    addPostData,
    setAddPostData
  }

  return (
    <PostContext.Provider value={contextValue}>
      {props.children}
    </PostContext.Provider>
  )
}

export default Index