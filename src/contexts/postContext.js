import React, { useState, createContext, useEffect } from 'react'

export const PostContext = createContext()


function Index(props) {
  const [addPostData, setAddPostData] = useState(null)
  const [deleteID, setDeleteID] = useState(null)
  const [editData, setEditData] = useState(null)

  const contextValue = {
    addPostData,
    setAddPostData,
    deleteID,
    setDeleteID,
    editData,
    setEditData
  }

  return (
    <PostContext.Provider value={contextValue}>
      {props.children}
    </PostContext.Provider>
  )
}

export default Index