import React, { useState, useRef, useEffect } from 'react'
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
  const { _id, image, user, likes, content, time } = props
  const listReactions = likes.map(v => v.react)
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

  const getEmojiFromLikes = reaction => {
    let newSet = new Set(listReactions)
    if (newSet.has(reaction)) return true
    return false
  }

  const getCurrentReact = () => {
    let react = likes.find(v => v.who._id === currentUser._id).react
    switch (react) {
      case 'LIKE':
        return <p style={{color: '#2078F4', margin: 0}} className='reacted'>Thích</p>
      case 'LOVE':
        return <p style={{color: '#F33E58', margin: 0}} className='reacted'>Yêu thích</p>
      case 'WOW':
        return <p style={{color: '#F7B126', margin: 0}} className='reacted'>Wow</p>
      case 'HAHA':
        return <p style={{color: '#F7B126', margin: 0}} className='reacted'>Haha</p>
      case 'SAD':
        return <p style={{color: '#F7B126', margin: 0}} className='reacted'>Buồn</p>
      case 'ANGRY':
        return <p style={{color: '#E9710E', margin: 0}} className='reacted'>Phẫn nộ</p>
      default:
        return ''
    }
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
        return <p key={v.who._id}>{v.who.firstName + ' ' + v.who.lastName}</p>
      })
    } catch (error) {
      console.log(error)
    }
  }

  const emoji = (
    <div className="post_emoji" id={`emoji${_id}`}>
      <EmojiReaction reactHandler={e => reactHandler(e)} />
    </div>
  )

  const reactHandler = reaction => {
    setEmojiVisible(false)
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
            {isEdit ? (
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
            )}
          </div>
          {image ? <img src={imageUrl} className="post_image"></img> : <></>}
        </div>
        {(likes.length > 0 || commentCount > 0) && (
          <div className="likes">
            <div className="likes-and-comments-count">
              <div className="likeCount">
                {getEmojiFromLikes('LIKE') && LIKE}
                {getEmojiFromLikes('LOVE') && HEART}
                {getEmojiFromLikes('WOW') && WOW}
                {getEmojiFromLikes('HAHA') && HAHA}
                {getEmojiFromLikes('SAD') && SAD}
                {getEmojiFromLikes('ANGRY') && ANGRY}
                {likes.length > 0 && (
                  <Popover content={whoLikes()}>{likes.length}</Popover>
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
            <Popover
              content={emoji}
              className="emoji_popover"
              placement="top"
              visible={emojiVisible}
              onVisibleChange={e => setEmojiVisible(e)}
            >
                <Button>
                  {
                    likes.map(v => v.who._id).indexOf(currentUser._id) !== -1 ? getCurrentReact() : 'Thích'
                  }
                </Button>
            </Popover>
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
