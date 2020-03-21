import React, { useState, useContext, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { Comment, Avatar, Menu, Dropdown, Spin, notification, Modal } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  LoadingOutlined,
} from '@ant-design/icons'

import maleUser from '@assets/images/man-user.png'
import femaleUser from '@assets/images/woman-user.png'

import { UserContext } from '@contexts/userContext'

import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import TextArea from 'antd/lib/input/TextArea'

const DELETE = gql`
  mutation delete($_id: String!) {
    deleteOneComment(_id: $_id)
  }
`
const EDIT = gql`
  mutation edit($editInput: EditInput!) {
    editOneComment(editInput: $editInput)
  }
`
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
const {confirm} = Modal

const Index = props => {
  const { data, removeComment } = props
  const { _id, who, time, text } = data
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
  const [editComment] = useMutation(EDIT)
  const [deleteComment] = useMutation(DELETE)

  const [isEdit, setIsEdit] = useState(false)
  const [editing, setEditing] = useState(false)

  const { user } = useContext(UserContext)
  const textRef = useRef(null)
  const [textData, setTextData] = useState(text)


  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          setIsEdit(true)
        }}
      >
        <EditOutlined /> Chỉnh sửa...
      </Menu.Item>
      <Menu.Item onClick={() => deleteHandler()}>
        <DeleteOutlined /> Xóa...
      </Menu.Item>
    </Menu>
  )

  const deleteHandler = () => {
    confirm({
      title: 'Bạn có chắc chắn muốn xoá bình luận này ?',
      centered: true,
      onOk() {
        deleteComment({
          variables: {
            _id
          },
        })
          .then(res => {
            if (res.data.deleteOneComment) {
                removeComment(_id)
            } else notify('Đã xảy ra lỗi khi xóa !', 2)
          })
          .catch(err => {
            notify('Đã xảy ra lỗi khi xóa !', 2)
          })
      },
      onCancel() {},
    })
  }

  const editHandler = e => {
    const text = textRef.current.state.value
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (text !== textData) {
        setEditing(true)
        editComment({
          variables: {
            editInput: {
              _id,
              text,
            },
          },
        })
          .then(res => {
            if (!res.data.editOneComment) {
              notify('Không thể sửa bình luận !', 2)
            }
            setEditing(false)
            setIsEdit(false)
            setTextData(text)
          })
          .catch(err => {
            setEditing(false)
            setIsEdit(false)
            notify('Đã có lỗi xảy ra !', 2)
          })
      } else {
        setIsEdit(false)
      }
    }
  }

  return (
    <div className="A_comment">
      <Comment
        avatar={
          <Avatar
            src={
              who.avatar ||
              (who.gender === 'female' ? femaleUser : maleUser)
            }
            alt={time}
            onClick={() => props.history.push(`profile/${who._id}`)}
          />
        }
        content={
          isEdit ? (
            <Spin spinning={editing} indicator={loadingIcon}>
              <TextArea
                id="AComment_text"
                autoSize
                autoFocus
                defaultValue={textData}
                ref={textRef}
                style={{
                  border: 'none',
                  backgroundColor: '#F2F2F2',
                  boxShadow: 'none',
                }}
                onPressEnter={e => editHandler(e)}
              />
            </Spin>
          ) : (
            <p>
              <a
                onClick={() => props.history.push(`profile/${who._id}`)}
              >{`${who.firstName} ${who.lastName} `}</a>
              {textData}
            </p>
          )
        }
      />
      {user._id === who._id &&
        (isEdit || (
          <Dropdown overlay={menu} trigger={['click']}>
            <EllipsisOutlined
              style={{
                fontSize: '22px',
              }}
              className="ant-dropdown-link"
            />
          </Dropdown>
        ))}
    </div>
  )
}

export default withRouter(Index)
