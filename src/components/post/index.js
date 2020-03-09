import React, { useState, useRef, useEffect } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import {
  Avatar,
  Comment,
  Modal,
  Popover,
  Icon as Ico,
  Spin,
  Menu,
  Dropdown,
  notification,
  Input,
  Button,
  Divider
} from 'antd'
import moment from 'moment'
import { Icon } from 'react-icons-kit'
import { heart } from 'react-icons-kit/fa/heart'
// import css
import './index.scss'

import Emoji from './emoji'
import CreateComment from '../createComment'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'

//Context
import { UserContext } from '@contexts/userContext'
import { PostContext } from '@contexts/postContext'
import { useContext } from 'react'

const GET_COMMENTS = gql`
query getcmt($id: String!){
  getCommentsByPostID(postID: $id){
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
const EDIT_A_POST = gql`
mutation edit($_id: ID!, $content: String!){
  updatePost(post: {
    _id:$ _id,
    content: $content
  })
}
`

const DELETE_ONE_POST = gql`
mutation delete($_id: String!){
  deletePost(postID: $_id)
}
`

const { TextArea } = Input

const Index = props => {
  const {
    _id,
    image,
    user,
    likes,
    content,
    time
  } = props

  const notify = (text, code) => {
    code === 1 ?
      notification.success({
        message: text,
        placement: 'bottomRight'
      }) :
      notification.error({
        message: text,
        placement: 'bottomRight'
      })
  }
  const { confirm } = Modal
  const postDay2 = new Date(time)
  const { user: currentUser } = useContext(UserContext)
  const [deleteAPost] = useMutation(DELETE_ONE_POST)
  const [editAPost] = useMutation(EDIT_A_POST)
  const { setDeleteID } = useContext(PostContext)
  const { setEditData } = useContext(PostContext)

  const [showAllComment, setShowAllComment] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const contentEditRef = useRef(content)

  const deleteHandler = () => {
    confirm({
      title: 'Bạn có chắc chắn muốn xoá bài viết này ?',
      centered: true,
      onOk() {
        deleteAPost({
          variables: { _id }
        }).then((res) => {
          res.data.deletePost ?
            notify('Xóa thành công !', 1) : notify('Đã xảy ra lỗi khi xóa !', 2)
          setDeleteID(_id)
        }).catch((err) => {
          notify(err, 2)
        })
      },
      onCancel() { }
    })
  }

  const editHandler = () => {
    try {
      const newContent = contentEditRef.current.state.value
      if(content !== newContent) {
        editAPost({variables:{
          _id,
          content: newContent
        }}).then((res) => {
          if(res.data.updatePost) {
            notify('Sửa thành công !', 1)
            setEditData({_id, newContent})
          } else 
           notify('Đã có lỗi xảy ra !', 2)
        }).catch(err => {
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
      <Menu.Item onClick={() => {
        setIsEdit(true)
        }}>
        <Ico type="edit" /> Edit this post
      </Menu.Item>
      <Menu.Item onClick={() => deleteHandler()}>
        <Ico type="delete" /> Delete this post
      </Menu.Item>
    </Menu>
  )

  const loadComments = () => {

  }

  const whoLikes = () => {
    try {
      return likes.map((v) => {
        return <p key={v.who._id}>{v.who.firstName + ' ' + v.who.lastName}</p>
      })
    } catch (error) {
      console.log(error)
    }
  }

  const emoji = (
    <div className='post_emoji' id={`emoji${_id}`}>
      <Emoji />
    </div>
  )

  const likeHandler = () => {

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
              <a title={time}>
                {moment([
                  postDay2.getFullYear(),
                  postDay2.getMonth(),
                  postDay2.getDate(),
                  postDay2.getHours(),
                  postDay2.getMinutes(),
                  postDay2.getSeconds(),
                  postDay2.getMilliseconds()
                ]).fromNow()}
              </a>
            </div>
          </div>
          <div className="top-right">
            {
              isEdit ?
                <div className='edit_btns'>
                <Button type='primary' onClick={() => editHandler()}>Xong</Button>
                </div> :
                <Dropdown overlay={menu} trigger={['click']}>
                  <Ico
                    style={{ fontSize: '28px' }}
                    type="ellipsis"
                    className="ant-dropdown-link"
                  />
                </Dropdown>
            }
          </div>
        </div>
        <div className="body">
          <div className="userContent">
            {
              isEdit ?
                <TextArea
                  id="editText"
                  autoSize
                  autoFocus
                  defaultValue={content}
                  ref = {contentEditRef}
                  style={{ border: 'none' }}
                /> : <p>{content}</p>
            }
          </div>
          {image ? <img src={image.url} className='post_image' ></img> : <></>}
        </div>
        <div className="likes">
          <Popover
            content={emoji}
            className='emoji_popover'
            placement="topLeft"
          >
            <Icon
              size={25}
              icon={heart}
              className={
                likes.map(v => {
                  return v.who._id
                }).indexOf(currentUser._id) !== -1 ? 'isLiked' : ''
              }
              id={_id}
              onClick={() => likeHandler()}
            />
          </Popover>

          <div className="likes-and-comments-count">
            <div className="likeCount">
              <Popover
                content={whoLikes()}
              >
                {likes.length}
              </Popover>
            </div>
            <div className="commentsCount">
              <a
                onClick={() => {
                  //loadComments()
                }}
              >
                123 bình luận
            </a>
            </div>
          </div>
        </div>
        <CreateComment
          idPost={_id}
          idCurrentUser={currentUser._id}
          // setShowAllComment={e => {
          //   setShowAllComment(e)
          // }}
          commentData=''
        />
        <div className="comments">
          <Spin spinning={false}>
            {/* {showAllComment && renderComments()} */}
          </Spin>
          {showAllComment && (
            <div className="seeAll">
              <a
                onClick={() => {
                }}
              >
                Hide comments
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default withRouter(Index)
