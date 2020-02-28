import React, { useState, useEffect, useContext, useMemo } from 'react'
//context
import { PostContext } from '@contexts/postContext'
import { Skeleton, Empty } from 'antd'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Post from '@components/post'


const POSTS = gql`
query posts($skip: Float!){
  posts(skip: $skip){
    _id
    who{
      email
      firstName
      lastName
      _id
    }
    image
    content
    time
    likes{
      who{
        _id
        firstName
        lastName
      }
    }
  }
}
`

const Index = () => {

  const [skip, setSkip] = useState(0)
  const { loading: postLoading, data, refetch } = useQuery(POSTS, {
    variables: {
      skip
    }
  })
  const [postList, setPostList] = useState([])
  const [loadingSke, setLoadingSke] = useState(true)
  const [loadingMore, setLoadingMore] = useState(true)
  const {addPostData, setAddPostData} = useContext(PostContext)

  useEffect(() => {
    if(addPostData){
      setPostList([addPostData, ...postList])
      setAddPostData(null)
    }
  }, [addPostData])  

  useBottomScrollListener(() => {
    console.log('bottom')
    setSkip((prev) => prev + 5)
    refetch().then((res) => {
      if (res.data.posts.length > 0) {
        let newList = postList.concat(res.data.posts)
        setPostList([...newList])
      } else {
        console.log('tat loading')
        setLoadingMore(false)
      }

    })
  })

  useEffect(() => {
    try {
      if (!postLoading && postList.length === 0) {
        setLoadingSke(false)
        setPostList([...data.posts])// 1
        setLoadingMore(true)
      }

    } catch (error) {
      setLoadingMore(false)
    }

  }, [postLoading])



  const loadPosts = useMemo(() => {
    try {
      if (postList.length !== 0)
        return postList.map((v, k) => {
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
      return 'Không thể tải bài viết  :('
    }
  }, [postList])

  return (
    <Skeleton loading={loadingSke} active >
      <div className='posts'>
        {postList.length > 0  ? loadPosts : <Empty/>}
      </div>
      <div className='postList_loadMore'>
        <Skeleton loading={loadingMore} active ></Skeleton>
      </div>
    </Skeleton>
  )

}

export default Index