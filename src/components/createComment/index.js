import React, { useState, useRef } from 'react'
import withAuthLogged from '../utils/hoc/authLogged'
import { Input, Avatar } from 'antd'
import './index.scss'

import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import maleUser from '@assets/images/man-user.png'
import femaleUser from '@assets/images/woman-user.png'

const { TextArea } = Input

const POST_COMMENT = gql`
  mutation postComment($commentInput: CommentInput!) {
    postOneComment(commentInput: $commentInput)
  }
`
const TYPING = gql`
  mutation typing($input: TypingInput!) {
    commentStatus(input: $input)
  }
`

function Index(props) {
  const { postID, setShowComments, user } = props
  const { avatar, gender, _id } = user
  const textRef = useRef(null)
  const [typingStatus, setTypingStatus] = useState(false)

  const [postComment] = useMutation(POST_COMMENT)
  const [typing] = useMutation(TYPING)

  const onChange = e => {
    const text = e.target.value
    if (text.length > 0 && !typingStatus) {
      setTypingStatus(true)
      typing({
        variables: {
          input: {
            postID,
            status: true,
            idWho: _id
          },
        },
      })
    }
    if (text.length === 0) {
      setTypingStatus(false)
      typing({
        variables: {
          input: {
            postID,
            status: false,
            idWho: _id
          },
        },
      })
    }
  }

  const postCommentHandler = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const text = textRef.current.state.value
      if (text.length > 0) {
        postComment({
          variables: {
            commentInput: {
              postID,
              text,
            },
          },
        }).then(() => {
          setShowComments(true)
          setTypingStatus(false)
          typing({
            variables: {
              input: {
                postID,
                status: false,
                idWho: _id
              },
            },
          })
          window.document.querySelector('[id="cmtText"]').value = ''
          textRef.current.state.value = null
        })
      }
    }
  }

  return (
    <div className="postComment">
      <Avatar
        size={25}
        src={avatar || (gender === 'female' ? femaleUser : maleUser)}
      />
      <TextArea
        id="cmtText"
        placeholder="Type comment here ..."
        autoSize
        style={{ borderRadius: '10px' }}
        onKeyPress={e => postCommentHandler(e)}
        ref={textRef}
        onChange={e => onChange(e)}
      />
    </div>
  )
}

export default withAuthLogged(Index)
