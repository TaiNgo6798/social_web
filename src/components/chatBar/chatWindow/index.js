import React, { useState, useEffect, useRef } from 'react'
import { Avatar, Badge, Icon, Input } from 'antd'

import './index.scss'


function Index(props) {

  const { htmlid, onClose, image, name } = props
  const [classNameBody, setClassNameBody] = useState(false)
  const [classNameHeader, setClassNameHeader] = useState(false)
  const [chatData, setChatData] = useState([])
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')))
  const message = useRef('')

  useEffect(() => {
    console.log('reload chat window !!!')
  }, [])

  const sendChatHandler = (e) => {
    if(e.key === 'Enter'){
      window.document.querySelector(`[id="${htmlid}"]`).value=''
    }
  }

  const loadChats = () => {
      return chatData.map((v,k) => {
        let className = ''
        let img = v.body.idUser === currentUser.id ? currentUser.image : v.body.image
        className=v.body.idUser === currentUser.id ? 'myChat' : ''
        return (
        <div className={`chat_item ${className}`} key={k}>
        <Avatar size={32} src={img} style={{marginTop: '8px'}}/>
        <div className='chat_data'>
          {v.body.body}
        </div>
        </div>
      )})
  }

  return <>
    <div className={`window_chatBar ${classNameHeader ? 'minimize_window_chatBar' : ''}`}  >
      <div className='header_window_chatBar window_width' onClick={() => {
        setClassNameBody(!classNameBody)
        setClassNameHeader(!classNameHeader)
      }}>
        <Badge color='green' style={{ backgroundColor: '#52c41a', margin: '5px' }}>
          <Avatar size={32} src={image} />
        </Badge>
        <p >{name}</p>
      </div>
      <Icon
        type="close"
        onClick={() => onClose(htmlid)}
        style={{
          position: 'absolute',
          marginTop: '1em',
          marginLeft: classNameBody ? '12em' : '18em'
        }}
      />
      <div className={`content_window_chatBar window_width ${classNameBody ? 'hide_window_chatBar' : ''}`} >
        {loadChats()}
      </div>
      <div className={`footer_window_chatBar window_width ${classNameBody ? 'hide_window_chatBar' : ''}`} >
        <input 
        id={htmlid}
        placeholder='Nhập tin nhắn ...'  
        ref={message} 
        onKeyDown={(e) => sendChatHandler(e)}
        />
      </div>
    </div>

  </>
}

export default Index