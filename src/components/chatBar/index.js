import React, { useState, useEffect } from 'react'
import { Avatar, Badge, Empty, Skeleton } from 'antd'
import ChatWindow from './chatWindow'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'

import './index.scss'
import { useQuery } from '@apollo/react-hooks'

import maleUser from '@assets/images/man-user.png'
import femaleUser from '@assets/images/woman-user.png'

const USERS = gql`
  query {
    users {
      _id
      email
      firstName
      lastName
      avatar
      dob
      gender
    }
  }
`

function Index() {
  const { data, loading } = useQuery(USERS)

  const [listActiveChat, setListActiveChat] = useState([])

  const loadUsers = () => {
    try {
      return data.users.map((v, k) => {
        return (
          <div
            className="user_chatBar"
            onClick={() => onUserClick(v._id)}
            key={k}
          >
            <Avatar
              size={34}
              src={v.avatar || (v.gender === 'female' ? femaleUser : maleUser)}
            />
            <p>{`${v.firstName} ${v.lastName}`}</p>
            <Badge color={'green'} />
          </div>
        )
      })
    } catch (error) {
      return <Skeleton loading={true} active />
    }
  }

  const closeActiveChatHandler = _id => {
    setListActiveChat([...listActiveChat.filter(v => v._id !== _id)])
  }

  const onUserClick = _id => {
    const { avatar, firstName, lastName, gender } = data.users.find(
      v => v._id === _id
    )
    if (!listActiveChat.some(v => v._id === _id)) {
      listActiveChat.push({
        _id,
        avatar: avatar || (gender === 'female' ? femaleUser : maleUser),
        name: `${firstName} ${lastName}`,
      })
      setListActiveChat([...listActiveChat])
    }
  }

  const loadActiveChat = () => {
    return listActiveChat.map((v, k) => {
      return (
        <ChatWindow
          key={v._id}
          htmlid={v._id}
          onClose={_id => closeActiveChatHandler(_id)}
          image={v.avatar}
          name={v.name}
        />
      )
    })
  }

  return (
    <>
      <div className="container_chatBar">
        {loading ? 'loading ...' : loadUsers()}
      </div>
      <div className="listActiveChat_chatBar">{loadActiveChat()}</div>
    </>
  )
}

export default withRouter(Index)
