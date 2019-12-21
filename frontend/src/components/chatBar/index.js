import React, { useState, useEffect } from 'react'
import { Avatar, Badge, Icon, Input } from 'antd'
import axios from "axios";
import ChatWindow from './chatWindow'
import { withRouter } from 'react-router-dom'


import './index.scss'


function Index() {

  const [listUser, setListUser] = useState([])
  const [listActiveChat, setListActiveChat] = useState([])
  const currentUser = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8080/reviewbook/users`,
    }).then((res) => {
      let list = []
      Object.keys(res.data).map((k) => {
        k !== (currentUser ? currentUser.id : '') &&
          list.push({
            id: k,
            infor: (res.data)[k]
          })
      })

      setListUser([...list])
    })
  }, [])

  const loadUsers = () => {
    return listUser.map((v, k) => {
      return (
        <div className='user_chatBar' onClick={() => onUserClick(v.id)} key={k}>
          <Avatar size={34} src={v.infor.image} />
          <p >{`${v.infor.firstName} ${v.infor.secondName}`}</p>
          <Badge color={'green'} />
        </div>
      )
    })
  }

  const closeActiveChatHandler = (id) => {
    setListActiveChat([...listActiveChat.filter(v => v.id !== id)])
  }

  const onUserClick = (id) => {
    const { image, firstName, secondName } = listUser.filter(v => v.id === id)[0].infor
    if (!listActiveChat.some(v => v.id === id)) {
      listActiveChat.push({
        id,
        image,
        name: `${firstName} ${secondName}`
      })
      setListActiveChat([...listActiveChat])
    }
  }

  const loadActiveChat = () => {
    return listActiveChat.map((v, k) => {
      return <ChatWindow
        key={k}
        htmlid={v.id}
        onClose={(id) => closeActiveChatHandler(id)}
        image={v.image}
        name={v.name}
      />
    })
  }

  return (
    window.location.pathname !== '/' ? (
      window.location.pathname !== '/login' ? (
      window.location.pathname !== '/admin' ? (
        <>
          <div className='container_chatBar'>
            {loadUsers()}
          </div>
          <div className='listActiveChat_chatBar'>
            {loadActiveChat()}
          </div>
        </>
      ) : '') : '' ) : ''
  )
}

export default withRouter(Index)