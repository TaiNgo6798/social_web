import React, { useState, useEffect, useContext } from 'react'
import { Skeleton, Empty } from 'antd'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'

//import components
import Post from '../../components/post'
import Infor from '../../components/infor'
import CreatePost from '../../components/createPost'

// import css
import './index.scss'

//context
import { UserContext } from '../../contexts/userContext'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'

const POSTS = gql`
query{
  posts{
    _id
    who {
      _id
      firstName
      lastName
      avatar
    }
    image
    content
    time
    likes
  }
}
`



function Index(props) {
  const { loading: loadingData, data, refetch } = useQuery(POSTS)

  const [loading, setLoading] = useState(true)

  const { user: currentUser } = useContext(UserContext)

  useBottomScrollListener(() => {
  })

  const loadPosts = () => {
    try {

      return data.posts.reverse().map((v, k) => {
        const {
          _id,
          who,
          image,
          content,
          time,
          likes
        } = v
        return <Post key={k}
          _id={_id}
          image={image}
          user={who}
          likes={likes || []}
          content={content}
          time={time}
        />
      })
    }
    catch (err) {
      return <Empty />
    }
  }

  return (
    <>
      <div className='content'>
        <div className='leftBar'>
        </div>
        <div className='wrapper'>
          <div className='center-content'>
            <CreatePost user={currentUser ? currentUser : { image: '', firstName: 'anonymous' }} />
            <Skeleton loading={loadingData} active >
              <div className='posts'>
                {loadingData || loadPosts()}
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