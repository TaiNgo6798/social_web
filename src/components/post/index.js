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
  Dropdown
} from 'antd'
import moment from 'moment'
import Swal from 'sweetalert2'
import htmlParser from 'react-html-parser'
import { Icon } from 'react-icons-kit'
import { heart } from 'react-icons-kit/fa/heart'
import { heartO } from 'react-icons-kit/fa/heartO'
// import css
import './index.scss'

import CreateComment from '../createComment'
import EditPostModal from './editPostModal'
import { withRouter } from 'react-router-dom'
import { FacebookShareButton } from 'react-share'


const Index = props => {
  const {
    commentCount,
    user,
    likes,
    img,
    nameImage,
    content,
    postTime,
    id,
    idCurrentUser,
    title,
    kind
  } = props
  const postDay2 = new Date(postTime)
  const { avatar, username } = user
  const [showAllComment, setShowAllComment] = useState(false)
  const [commentData, setCommentData] = useState([])
  const [likeLocal, setLikeLocal] = useState([])
  const [iconType, setIconType] = useState(
    Object.keys(likes).indexOf(idCurrentUser) !== -1 ? heart : heartO
  )
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const [loadingCmt, setLoadingCmt] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const dateNow = Date.now()
 
  const { confirm } = Modal

  useEffect(() => {
    let likeList = []
    Object.keys(likes).forEach((v, k) => {
      likeList.push({
        id: v,
        name: Object.values(likes)[k]
      })
    })
    setLikeLocal(likeList)

    const likeBtn = window.document.querySelector(`[id=${id}]`)
    likeBtn.addEventListener('click', () => {
      likeBtn.classList.toggle('isLiked')
      likeBtn.classList.contains('isLiked')
        ? setIconType(heart)
        : setIconType(heartO)
    })
  }, [])

  const deleteHandler = () => {
    confirm({
      title: 'Bạn có chắc chắn muốn xoá bài viết này ?',
      onOk() {

      },
      onCancel() {}
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
    setLoadingCmt(true)
    setShowAllComment(true)

  }

  const whoLikes = () => {
    let html = ''
    likeLocal.forEach(v => {
      html += `<p>${v.name}<p/>`
    })
    return htmlParser(html)
  }

  const likeHandler = () => {

  }

  const renderComments = () => {
    return Object.values(commentData).map((v, k) => {
      let time2 = new Date(v.time)
      return (
        <Comment
          key={v.id}
          author={v.nameUser}
          avatar={<Avatar src={v.imageUser} alt={v.time} onClick={() => props.history.push(`profile/${v.id_user}`)}/>}
          content={<p>{v.body}</p>}
          datetime={
            <Tooltip title={time2.toLocaleString()}>
              <span>
                {moment([
                  time2.getFullYear(),
                  time2.getMonth(),
                  time2.getDate(),
                  time2.getHours(),
                  time2.getMinutes(),
                  time2.getSeconds(),
                  time2.getMilliseconds()
                ]).fromNow()}
              </span>
            </Tooltip>
          }
        />
      )
    })
  }

  return (
    <>
      <div className="postForm">
        <div className="header">
          <div className="avatar">
            <Avatar
              size={45}
              src={avatar}
              onClick={() => props.history.push(`/profile/${user.id}`)}
            />
          </div>
          <div className="username">
            <p onClick={() => props.history.push(`/profile/${user.id}`)}>
              <i>{username}</i>
            </p>
            <div className="time">
              <a title={postTime}>
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
            {user.id.indexOf(idCurrentUser) !== -1 && (
              <Dropdown overlay={menu} trigger={['click']}>
                <Ico
                  style={{ fontSize: '28px' }}
                  type="ellipsis"
                  className="ant-dropdown-link"
                />
              </Dropdown>
            )}
          </div>
        </div>
        <div className="body">
          <img src={img}></img>
        </div>
        <div className="likes">
          <Icon
            size={24}
            icon={iconType}
            className={
              Object.keys(likes).indexOf(idCurrentUser) !== -1 ? 'isLiked' : ''
            }
            id={id}
            onClick={() => likeHandler()}
          />
          <Ico
            style={{ fontSize: '24px' }}
            type="message"
            onClick={() => {
              loadComments()
            }}
          />
          <Ico style={{ fontSize: '24px' }} type="link" />
        </div>
        <div className="likes-and-comments">
          <div className="likeCount">
            <Popover content={whoLikes()}>
              {likeLocal.length} lượt thích
            </Popover>
          </div>
          <div className="commentsCount">
            <a
              onClick={() => {
                loadComments()
              }}
            >
              {commentData.length > 1 ? commentData.length : commentCount} bình
              luận
            </a>
          </div>
        </div>
        <div className="userContent">
          <p style={{ margin: '0 5px 0 0' }}>{username}</p>
          <p>{content}</p>
        </div>
        <CreateComment
          idPost={id}
          idCurrentUser={idCurrentUser}
          setShowAllComment={e => {
            setShowAllComment(e)
          }}
          commentData={commentData}
        />
        <div className="comments">
          <Spin spinning={loadingCmt}>
            {showAllComment && renderComments()}
          </Spin>
          {showAllComment && (
            <div className="seeAll">
              <a
                onClick={() => {
                  setShowAllComment(false)
                }}
              >
                Hide comments
              </a>
            </div>
          )}
        </div>
        <EditPostModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          idPost={id}
          title={title}
          kind={kind}
          desc={content}
          url={img}
          nameImage={nameImage}
          currentUser={currentUser}
          params={props.params}
        />
      </div>
    </>
  )
}

export default withRouter(Index)
