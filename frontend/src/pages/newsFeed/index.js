import React, { useState, useEffect } from 'react'
import { Skeleton, Empty } from 'antd'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import axios from 'axios'
//import components
import Post from '../../components/post'
import Infor from '../../components/infor'
import FirstRegister from '../../components/firstRegister'
import LeftBar from '../../components/leftBar'
import CreatePost from '../../components/createPost'

// import css
import './index.scss'

//import redux
import { useSelector, useDispatch } from 'react-redux'
import { setPost } from '../../actions/posts/setPost'

import firebase from "firebase";
import { loadMore } from '../../actions/posts/loadMore'
import { postNew, removeNewPost } from '../../firebase/my-firebase'




function Index(props) {
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [postList, setPostList] = useState([])
  const [lastPost, setLastPost] = useState({})
  //redux
  const posts = useSelector(state => state.postReducer)
  const dispatch = useDispatch()

  useBottomScrollListener(() => {
    lastPost.numberTime &&
    axios({
      method: 'get',
      url: `http://localhost:8080/reviewbook/review/post/${lastPost.numberTime}`,
    }).then((res) => {
      try{
        res.data.length > 0 &&
        setLastPost(Object.values(res.data[res.data.length - 1])[0])
        postNew.map(v => {
          res.data.unshift(v)
        })
        dispatch(loadMore(res.data.success === false ? [] : res.data))
        removeNewPost()
      } catch{}

    })
  })

  useEffect(() => {
    axios({
      method: 'get',
      url: `http://localhost:8080/reviewbook/review/post`,

    }).then((res) => {
      dispatch(setPost(res.data))
      setPostList(res.data)
      setLoading(false)
      try{
        if(!res.data.success){
          setLastPost(Object.values(res.data[res.data.length - 1])[0])
        }
      } catch{}

    })

  }, [])

  const loadPosts = () => {
    const list = (posts ? posts : postList)
    try {
      return list.map((v, k) => {
        let value = Object.values(v)[0]
        let id = Object.keys(v)[0] //id bai viet
        let postUser = {
          id: value.uid,
          avatar: value.urlUser,
          username: value.name
        }
        return <Post key={k}
          img={value.urlImage}
          user={postUser} // nguoi dang
          likes={value.likes ? value.likes : {}}
          commentCount={value.comments ? Object.keys(value.comments).length : 0}
          content={value.desc}
          postTime={value.time}
          id={id}
          idCurrentUser={currentUser ? currentUser.id : null}
          title={value.title}
          kind={value.kind}
        />
      })
    }
    catch (err) {
      return <Empty />
    }
  }



  return (
    <>
      {
        localStorage.getItem('token') === 'setting account' &&
        <FirstRegister setCurrentUser={(u) => setCurrentUser(u)} />
      }
      
      <div className='content'>
        <div className='leftBar'>
          {/* <LeftBar /> */}
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

export default Index