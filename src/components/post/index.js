import React, { useState, useRef, useEffect } from 'react'
import {
  Avatar,
  Comment,
  Tooltip,
  Modal,
  Button,
  Popover,
  Icon as Ico,
  Spin,
  Menu,
  Dropdown,
  Divider
} from 'antd'
import moment from 'moment'
import { Icon } from 'react-icons-kit'
import { heart } from 'react-icons-kit/fa/heart'
// import css
import './index.scss'

import Emoji from './emoji'
import CreateComment from '../createComment'
import EditPostModal from './editPostModal'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'

//Context
import { UserContext } from '@contexts/userContext'
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

const Index = props => {
  const {
    _id,
    image,
    user,
    likes,
    content,
    time
  } = props


  const postDay2 = new Date(time)
  const [showAllComment, setShowAllComment] = useState(false)
  const { user: currentUser } = useContext(UserContext)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const { confirm } = Modal


  useEffect(() => {
    let mounted = true
    if (mounted) {



      // Object.keys(likes).forEach((v, k) => {
      //   likeList.push({
      //     id: v,
      //     name: Object.values(likes)[k]
      //   })
      // })
      // const likeBtn = window.document.querySelector(`[id=${_id}]`) 
      // likeBtn.addEventListener('click', () => {
      //   likeBtn.classList.toggle('isLiked')
      //   likeBtn.classList.contains('isLiked')
      //     ? setIconType(heart)
      //     : setIconType(heartO)
      // })
    }
    return () => { mounted = false }
  }, [])

  const deleteHandler = () => {
    confirm({
      title: 'Bạn có chắc chắn muốn xoá bài viết này ?',
      onOk() {

      },
      onCancel() { }
    })
  }

  const editHandler = () => {
    setEditModalVisible(true)
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={() => editHandler()}>
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

  const showEmojiHandler = (e) => {
    const emoji = window.document.querySelector(`#emoji${_id}`)
    emoji.classList.add('emoji_show')
  }

  const hideEmojiHandler = () => {
    const emoji = window.document.querySelector(`#emoji${_id}`)
    emoji.classList.remove('emoji_show')
  }

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
            <Dropdown overlay={menu} trigger={['click']}>
              <Ico
                style={{ fontSize: '28px' }}
                type="ellipsis"
                className="ant-dropdown-link"
              />
            </Dropdown>
          </div>
        </div>
        <div className="body">
          <div className="userContent">
            <p>{content}</p>
          </div>
          {image ? <img src={image} className='post_image' ></img> : <></>}
        </div>
        <div className="likes">
          <Popover
            content={emoji}
            className='emoji_popover'
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
        <EditPostModal
          visible={editModalVisible}
          //onCancel={() => setEditModalVisible(false)}
          idPost={_id}
          desc={content}
          url={image}
          currentUser={currentUser}
        />
      </div>
    </>
  )
}

export default withRouter(Index)
