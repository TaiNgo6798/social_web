import React, { useMemo, useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import './index.scss'
import AComment from './AComment'

const GET_COMMENTS = gql`
  query getCmt($postID: String!) {
    getCommentsByPostID(postID: $postID) {
      _id
      who {
        _id
        firstName
        lastName
        email
        avatar
        gender
      }
      postID
      text
      time
    }
  }
`
const COMMENT_ADDED = gql`
  subscription commentAdded($postID: String!) {
    commentCreated(postID: $postID) {
      _id
      who {
        _id
        firstName
        lastName
        email
        gender
        avatar
      }
      text
      time
    }
  }
`

const TYPING = gql`
  subscription typing($postID: String!) {
    commentTyping(postID: $postID) {
      status
    }
  }
`

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const Index = props => {
  const { postID, setCommentCount } = props
  const [listComment, setListComment] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const { loading, data } = useQuery(GET_COMMENTS, {
    variables: {
      postID,
    },
  })
  useSubscription(COMMENT_ADDED, {
    variables: {
      postID,
    },
    onSubscriptionData: e => recieveNewComment(e.subscriptionData.data),
  })

  useSubscription(TYPING, {
    variables: {
      postID,
    },
    onSubscriptionData: e =>
      e.subscriptionData.data.commentTyping.status
        ? setIsTyping(true)
        : setIsTyping(false),
  })

  useEffect(() => {
    let mounted = true
    if (mounted) {
      if (!loading && listComment.length === 0) {
        setListComment([...data.getCommentsByPostID])
      }
    }
    return () => {
      mounted = false
    }
  }, [loading])

  useEffect(() => {
    let mounted = true
    if (mounted) {
      if (listComment.length >= 0) {
        setCommentCount(listComment.length)
      }
    }
    return () => {
      mounted = false
    }
  }, [listComment])

  const recieveNewComment = data => {
    try {
      const { commentCreated: newComment } = data
      setListComment([newComment, ...listComment])
    } catch (error) {
      console.log(error)
    }
  }

  const removeComment = (_id) => {
    setListComment([...listComment.filter(v => v._id !== _id)])
  }

  const renderComments = useMemo(() => {
    try {
      return listComment.map(v => {
        return <AComment key={v._id} data={v} removeComment={(_id) => removeComment(_id)}/>
      })
    } catch (error) {
      console.log(error)
    }
  }, [listComment])

  const typing = (
    <div className={'typing_comment'}>
      <p>Có ai đó đang nhập bình luận ...</p>
    </div>
  )

  return (
    <>
      <Spin spinning={loading} indicator={loadingIcon}>
        {loading && <div style={{ marginTop: '5em' }} />}
        {isTyping && typing}
        {renderComments}
      </Spin>
    </>
  )
}

export default withRouter(Index)
