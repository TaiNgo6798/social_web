import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Modal,
  Popover,
  Spin,
  Menu,
  Dropdown,
  notification,
  Input,
  Button,
  Tooltip,
} from 'antd'
import moment from 'moment'

// import css
import './index.scss'

import EmojiReaction, { LIKE, HEART, HAHA, WOW, SAD, ANGRY } from './emoji'

import CreateComment from '../createComment'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'

//Context
import { UserContext } from '@contexts/userContext'
import { PostContext } from '@contexts/postContext'
import { useContext } from 'react'

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

  const [showAllComment, setShowAllComment] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const contentEditRef = useRef(content)
  const [commentCount, setCommentCount] = useState(10)
  const [emojiVisible, setEmojiVisible] = useState(false)
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

  // const renderComments = () => {
  //   return Object.values(commentData).map((v, k) => {
  //     let time2 = new Date(v.time)
  //     return (
  //       <Comment
  //         key={v.id}
  //         author={v.nameUser}
  //         avatar={<Avatar src={v.imageUser} alt={v.time} onClick={() => props.history.push(`profile/${v.id_user}`)} />}
  //         content={<p>{v.body}</p>}
  //         datetime={
  //           <Tooltip title={time2.toLocaleString()}>
  //             <span>
  //               {moment([
  //                 time2.getFullYear(),
  //                 time2.getMonth(),
  //                 time2.getDate(),
  //                 time2.getHours(),
  //                 time2.getMinutes(),
  //                 time2.getSeconds(),
  //                 time2.getMilliseconds()
  //               ]).fromNow()}
  //             </span>
  //           </Tooltip>
  //         }
  //       />
  //     )
  //   })
  // }

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
          {image ? <img src={imageUrl} className="post_image"></img> : <></>}
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
          // setShowAllComment={e => {
          //   setShowAllComment(e)
          // }}
          commentData=""
        />
        <div className="comments">
          <Spin spinning={false}>
            {/* {showAllComment && renderComments()} */}
          </Spin>
          {showAllComment && (
            <div className="seeAll">
              <a onClick={() => {}}>Hide comments</a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default withRouter(Index)
