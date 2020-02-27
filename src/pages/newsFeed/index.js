import React, { useContext } from 'react'
import { withRouter } from 'react-router-dom'

//import components
import Infor from '../../components/infor'
import CreatePost from '../../components/createPost'
import PostList from './postList'
// import css
import './index.scss'

//context
import { UserContext } from '@contexts/userContext'


function Index(props) {
  const { user: currentUser } = useContext(UserContext)
  return (
    <>
      <div className='content'>
        <div className='leftBar'>
        </div>
        <div className='wrapper'>
          <div className='center-content'>
            <CreatePost user={currentUser ? currentUser : { image: '', firstName: 'anonymous' }} />
           <PostList />
          </div>
          <div className='infor'>
            <Infor user={currentUser ? currentUser : { image: '', firstName: 'anonymous' }} />
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(Index)