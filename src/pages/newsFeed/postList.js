import React, { useState, useEffect, useContext, useMemo } from 'react'
//context
import { PostContext } from '@contexts/postContext'
import { Skeleton, Empty, Input } from 'antd'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Post from '@components/post'

const POSTS = gql`
  query posts($skip: Float!) {
    posts(skip: $skip) {
      _id
      who {
        email
        firstName
        lastName
        _id
        gender
        avatar
      }
      image {
        id
        url
      }
      content
      time
      likes {
        who {
          _id
          firstName
          lastName
        }
        react
      }
      commentsCount
    }
  }
`

const Index = () => {
  const [skip, setSkip] = useState(0)
  const { loading: postLoading, data, refetch } = useQuery(POSTS, {
    variables: {
      skip,
    },
  })
  const [postList, setPostList] = useState([])
  const [loadingSke, setLoadingSke] = useState(true)
  const [loadingMore, setLoadingMore] = useState(true)
  const {
    addPostData,
    setAddPostData,
    deleteID,
    setDeleteID,
  } = useContext(PostContext)

  useEffect(() => {
    if (addPostData) {
      setPostList([addPostData, ...postList])
      setAddPostData(null)
    }
    if (deleteID) {
      setPostList([...postList.filter(v => v._id !== deleteID)])
      setDeleteID(null)
    }
  }, [addPostData, deleteID])

  useBottomScrollListener(() => {
    setSkip(prev => prev + 10)
    refetch().then(res => {
      if (res.data.posts.length > 0) {
        let newList = postList.concat(res.data.posts)
        setPostList([...newList])
      } else {
        setSkip(prev => prev - 10)
        setLoadingMore(false)
      }
    })
  })

  useEffect(() => {
    try {
      if (!postLoading && postList.length === 0) {
        setLoadingSke(false)
        setPostList([...data.posts]) // 1
        setLoadingMore(true)
      }
    } catch (error) {
      setLoadingMore(false)
    }
  }, [postLoading])

  const loadPosts = useMemo(() => {
    try {
      if (postList.length !== 0) {
        return postList.map((v) => {
          const { _id, who, image, content, time, likes, commentsCount } = v
          return (
            <Post
              key={_id}
              _id={_id}
              image={image}
              user={who}
              likes={likes || []}
              content={content}
              time={time}
              commentsCount = {commentsCount}
            />
          )
        })
      }
    } catch (err) {
      return 'Không thể tải bài viết  :('
    }
  }, [postList])

  return (
    <Skeleton loading={loadingSke} active>
      <div className="posts">{postList.length > 0 ? loadPosts : <Empty />}</div>
      <div className="postList_loadMore">
        <Skeleton loading={loadingMore} active></Skeleton>
      </div>
    </Skeleton>
  )
}

export default Index
