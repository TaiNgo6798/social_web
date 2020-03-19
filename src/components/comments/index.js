import React, { useMemo, useEffect, useState } from 'react'
import { Comment, Tooltip, Spin, Avatar, Popover } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'

import maleUser from '@assets/images/man-user.png'
import femaleUser from '@assets/images/woman-user.png'
import typingImage from '@assets/images/typing.gif'

import './index.scss'
import { withRouter } from 'react-router-dom'

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
      if (listComment.length > 0) setCommentCount(listComment.length)
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

  const AComment = v => {
    return (
      <Comment
        key={v._id}
        author={`${v.who.firstName} ${v.who.lastName}`}
        avatar={
          <Avatar
            src={
              v.who.avatar ||
              (v.who.gender === 'female' ? femaleUser : maleUser)
            }
            alt={v.time}
            onClick={() => props.history.push(`profile/${v.who._id}`)}
          />
        }
        content={<p>{v.text}</p>}
        datetime={
          <Tooltip title={v.time}>
            <span>{moment(v.time).fromNow()}</span>
          </Tooltip>
        }
      />
    )
  }

  const renderComments = useMemo(() => {
    try {
      return listComment.map(v => {
        return AComment(v)
      })
    } catch (error) {
      console.log(error)
    }
  }, [listComment])

  const typing = (
    <div className={'typing_comment'}>
      <img src={typingImage} />
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
