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
  Spin,
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


import EmojiReaction, { LIKE, HEART, HAHA, WOW, SAD, ANGRY } from './emoji'

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

const GET_COMMENTS = gql`
query getCmt($postID: String!) {
  getCommentsByPostID(postID: $postID){
    _id
    who{
      _id
      firstName
      lastName
      email
    }
    postID
    text
    time
  }
}
`

const { TextArea } = Input

const Index = props => {
  const { history } = props
  const { _id, image, user, likes: dataLikes, content, time } = props

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
  const TIME = moment([
    postDay.getFullYear(),
    postDay.getMonth(),
    postDay.getDate(),
    postDay.getHours(),
    postDay.getMinutes(),
    postDay.getSeconds(),
    postDay.getMilliseconds(),
  ])
  const { user: currentUser } = useContext(UserContext)
  const [deleteAPost] = useMutation(DELETE_ONE_POST)
  const [editAPost] = useMutation(EDIT_A_POST)
  const [likeAPost] = useMutation(DO_LIKE)
  const { setDeleteID } = useContext(PostContext)
  const { setEditData } = useContext(PostContext)
  const [getComments, { loading: loadingComments, data: commentsData }] = useLazyQuery(GET_COMMENTS)

  const [isEdit, setIsEdit] = useState(false)
  const contentEditRef = useRef(content)
  const [commentCount, setCommentCount] = useState(10)
  const [likes, setLikes] = useState(dataLikes) // current Likes

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
            notify(err, 2)
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
              setEditData({ _id, newContent })
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

  const loadComments = () => {}

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

  const renderComments = () => {
    return Object.values(commentData).map((v, k) => {
      return (
        <Comment
          key={v.id}
          author={v.nameUser}
          avatar={<Avatar src={v.imageUser} alt={v.time} onClick={() => props.history.push(`profile/${v.id_user}`)} />}
          content={<p>{v.body}</p>}
          datetime={
            <Tooltip title={time2.toLocaleString()}>
              <span>
                {TIME.fromNow()}
              </span>
            </Tooltip>
          }
        />
      )
    })
  }

  const postEditor = isEdit ? (
    <TextArea
      id="editText"
      autoSize
      autoFocus
      defaultValue={content}
      ref={contentEditRef}
      style={{ border: 'none' }}
    />
  ) : (
    <p>{content}</p>
  )

  return (
    <>
      <div className="postForm">
        <div className="header">
          <div className="avatar">
            <Avatar
              size={40}
              src={user.avatar}
              onClick={() => props.history.push(`/profile/${user._id}`)}
            />
          </div>
          <div className="username">
            <p onClick={() => props.history.push(`/profile/${user._id}`)}>
              {`${user.firstName || ''} ${user.lastName || ' '}`}
            </p>
            <div className="time">
              <a title={postDay}>{TIME.fromNow()}</a>
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
            {postEditor}
          </div>
          {image ? (
              <Img 
              src={imageUrl}
              loader={<img src={LoadingImage} width='100%' style={{objectFit: 'cover'}}/>}
              />
          ) : (
            <></>
          )}
        </div>
        {(likes.length > 0 || commentCount > 0) && (
          <div className="likes">
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
              {commentCount > 0 && (
                <div className="commentsCount">
                  <a>{commentCount} bình luận</a>
                </div>
              )}
            </div>
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
            <Button>Bình luận</Button>
          </div>
        </div>
        <CreateComment
          idPost={_id}
          idCurrentUser={currentUser._id}
          commentData=""
        />
        <div className="comments">
          <Spin spinning={false}>

          </Spin>
        </div>
      </div>
    </>
  )
}

export default withRouter(Index)
