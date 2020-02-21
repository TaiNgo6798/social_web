import React, { useState, useEffect } from 'react'
import { Skeleton, Empty } from 'antd'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import { withRouter } from 'react-router-dom'

//import components
import Post from '../../components/post'
import Infor from '../../components/infor'
import CreatePost from '../../components/createPost'

// import css
import './index.scss'


function Index(props) {
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [postList, setPostList] = useState([])
  const [lastPost, setLastPost] = useState({})

  useBottomScrollListener(() => {
  })


  const loadPosts = () => {
    // const list = (posts ? posts : postList)
    // try {
    //   return list.map((v, k) => {
    //     let value = Object.values(v)[0]
    //     let id = Object.keys(v)[0] //id bai viet 
    //     let postUser = {
    //       id: value.uid,
    //       avatar: value.urlUser,
    //       username: value.name
    //     }
    //     return <Post key={k}
    //       img={value.urlImage}
    //       user={postUser} // nguoi dang
    //       likes={value.likes ? value.likes : {}}
    //       commentCount={value.comments ? Object.keys(value.comments).length : 0}
    //       content={value.desc}
    //       postTime={value.time}
    //       id={id}
    //       idCurrentUser={currentUser ? currentUser.id : null}
    //       title={value.title}
    //       kind={value.kind}
    //     />
    //   })
    // }
    // catch (err) {
    //   return <Empty />
    // }
  }

  return (
    <>
      <div className='content'>
        <div className='leftBar'>
        </div>
        <div className='wrapper'>
          <div className='center-content'>
            <CreatePost user={currentUser ? currentUser : { image: '', firstName: 'anonymous' }} />
            <Skeleton loading={loading} active >
              <div className='posts'>
                {loadPosts()}
              </div>
            </Skeleton>
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