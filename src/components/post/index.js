import React, { useState, useRef, useContext } from 'react'
import { useMutation, useLazyQuery } from '@apollo/react-hooks'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Modal,
  Menu,
  Dropdown,
  notification,
  Input,
  Button,
  Tooltip,
} from 'antd'
import moment from 'moment'
import Img from 'react-image'
import LoadingImage from '@assets/images/loading.gif'

// import css
import './index.scss'

//import components
import Comments from '@components/comments'

import maleUser from '@assets/images/man-user.png'
import femaleUser from '@assets/images/woman-user.png'

import EmojiReaction, {
  LIKE,
  HEART,
  HAHA,
  WOW,
  SAD,
  ANGRY,
} from './emoji-reaction-button'

import CreateComment from '../createComment'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'

//Context
import { UserContext } from '@contexts/userContext'
import { PostContext } from '@contexts/postContext'

const EDIT_A_POST = gql`
  mutation edit($_id: ID!, $content: String!) {
    updatePost(post: { _id: $_id, content: $content })
  }
`

const DELETE_ONE_POST = gql`
  mutation delete($deleteInput: DeleteInput!) {
    deletePost(deleteInput: $deleteInput)
  }
`

const DO_LIKE = gql`
  mutation like($postID: String!, $react: REACT!) {
    doLike(likeInput: { postID: $postID, react: $react })
  }
`

const { TextArea } = Input

const Index = props => {
  const { history } = props
  const {
    _id,
    image,
    user,
    likes: dataLikes,
    content,
    time,
    commentsCount: dataCommentsCount,
  } = props

  const { id: imageID, url: imageUrl } = image

  const notify = (text, code) => {
    code === 1
      ? notification.success({
          message: text,
          placement: 'bottomRight',
        })
      : notification.error({
          message: text,
          placement: 'bottomRight',
        })
  }
  const { confirm } = Modal
  const postDay = new Date(time)
  
  const { user: currentUser } = useContext(UserContext)
  const { setDeleteID, setEditData } = useContext(PostContext)
  const [deleteAPost] = useMutation(DELETE_ONE_POST)
  const [editAPost] = useMutation(EDIT_A_POST)
  const [likeAPost] = useMutation(DO_LIKE)

  //local state
  const [isEdit, setIsEdit] = useState(false)
  const contentEditRef = useRef(content)
  const [commentsCount, setCommentCount] = useState(dataCommentsCount)
  const [likes, setLikes] = useState(dataLikes) // current Likes
  const [showComments, setShowComments] = useState(false)
  const [localContent, setLocalContent] = useState(content)

  const deleteHandler = () => {
    confirm({
      title: 'Bạn có chắc chắn muốn xoá bài viết này ?',
      centered: true,
      onOk() {
        deleteAPost({
          variables: {
            deleteInput: {
              postID: _id,
              imageID,
            },
          },
        })
          .then(res => {
            if (res.data.deletePost) {
              notify('Xóa thành công !', 1)
              setDeleteID(_id)
            } else notify('Đã xảy ra lỗi khi xóa !', 2)
          })
          .catch(err => {
            notify('Đã xảy ra lỗi khi xóa !', 2)
          })
      },
      onCancel() {},
    })
  }

  const isThisPostHasEmoji = reaction => {
    let newSet = new Set(likes.map(v => v.react))
    if (newSet.has(reaction)) return true
    return false
  }

  const editHandler = () => {
    try {
      const newContent = contentEditRef.current.state.value
      if (content !== newContent) {
        editAPost({
          variables: {
            _id,
            content: newContent,
          },
        })
          .then(res => {
            if (res.data.updatePost) {
              notify('Sửa thành công !', 1)
              setLocalContent(newContent)
            } else notify('Đã có lỗi xảy ra !', 2)
          })
          .catch(err => {
            notify('Đã có lỗi xảy ra !', 2)
          })
      }
    } catch (error) {
      notify('Đã có lỗi xảy ra !', 2)
    }
    setIsEdit(false)
  }

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          setIsEdit(true)
        }}
      >
        <EditOutlined /> Chỉnh sửa bài viết
      </Menu.Item>
      <Menu.Item onClick={() => deleteHandler()}>
        <DeleteOutlined /> Xóa
      </Menu.Item>
    </Menu>
  )

  const whoLikes = () => {
    try {
      return likes.map(v => {
        return (
          <p
            className="who_like_item"
            key={v.who._id}
            onClick={() => {
              history.push(`/profile/${v.who._id}`)
            }}
          >
            {v.who.firstName + ' ' + v.who.lastName}
          </p>
        )
      })
    } catch (error) {
      console.log(error)
    }
  }

  const reactHandler = reaction => {
    let newLike = {
      who: currentUser,
      react: reaction,
    }
    if (likes.filter(v => v.who._id === currentUser._id).length === 0) {
      setLikes([...likes, newLike])
    } else {
      let newList = likes.map(v => {
        if (v.who._id === currentUser._id) {
          v.react = reaction
        }
        return v
      })
      setLikes([...newList])
    }
    likeAPost({
      variables: {
        postID: _id,
        react: reaction,
      },
    })
  }

  const postContent = isEdit ? (
    <TextArea
      id="editText"
      autoSize
      autoFocus
      defaultValue={localContent}
      ref={contentEditRef}
      style={{ border: 'none' }}
    />
  ) : (
    <p>{localContent}</p>
  )

  return (
    <>
      <div className="postForm">
        <div className="header">
          <div className="avatar">
            <Avatar
              key={_id}
              size={40}
              src={
                user.avatar ||
                (user.gender === 'female' ? femaleUser : maleUser)
              }
              onClick={() => props.history.push(`/profile/${user._id}`)}
            />
          </div>
          <div className="username">
            <p onClick={() => props.history.push(`/profile/${user._id}`)}>
              {`${user.firstName || ''} ${user.lastName || ' '}`}
            </p>
            <div className="time">
            <Tooltip title={moment(postDay).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(postDay).fromNow()}</span>
          </Tooltip>
            </div>
          </div>
          {user._id === currentUser._id && (
            <div className="top-right">
              {isEdit ? (
                <div className="edit_btns">
                  <Button type="primary" onClick={() => editHandler()}>
                    Xong
                  </Button>
                </div>
              ) : (
                <Dropdown overlay={menu} trigger={['click']}>
                  <EllipsisOutlined
                    style={{ fontSize: '28px' }}
                    className="ant-dropdown-link"
                  />
                </Dropdown>
              )}
            </div>
          )}
        </div>
        <div className="body">
          <div className={`userContent ${image.url ? '' : 'bigger_content'}`}>
            {postContent}
          </div>
          {image ? (
            <Img
              src={imageUrl}
              loader={
                <img
                  src={LoadingImage}
                  width="100%"
                  style={{ objectFit: 'cover' }}
                />
              }
            />
          ) : (
            <></>
          )}
        </div>
        {(likes.length > 0 || commentsCount > 0) && (
          <div className="likes-and-comments-count">
            <div className="likeCount">
              {isThisPostHasEmoji('LIKE') && LIKE}
              {isThisPostHasEmoji('LOVE') && HEART}
              {isThisPostHasEmoji('WOW') && WOW}
              {isThisPostHasEmoji('HAHA') && HAHA}
              {isThisPostHasEmoji('SAD') && SAD}
              {isThisPostHasEmoji('ANGRY') && ANGRY}
              {likes.length > 0 && (
                <Tooltip title={whoLikes()}>{likes.length}</Tooltip>
              )}
            </div>
            {commentsCount > 0 && (
              <div className="commentsCount">
                <a>{commentsCount} bình luận</a>
              </div>
            )}
          </div>
        )}
        <div className="reactions">
          <div className="buttons">
            <EmojiReaction
              key={_id}
              reactHandler={e => reactHandler(e)}
              likes={likes}
              currentUser={currentUser}
            />
            <Button onClick={() => setShowComments(!showComments)}>
              Bình luận
            </Button>
          </div>
        </div>
        <div className="comments">
          {showComments ? (
            <>
              <CreateComment
                postID={_id}
                user={currentUser}
              />
              <Comments
                postID={_id}
                currentUser={currentUser}
                setCommentCount={e => setCommentCount(e)}
              />
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default withRouter(Index)
