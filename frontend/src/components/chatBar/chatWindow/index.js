import React, { useState, useEffect, useRef } from 'react'
import { Avatar, Badge, Icon, Input } from 'antd'
import axios from 'axios'
import firebase from "firebase";

import './index.scss'


function Index(props) {

  const { htmlid, onClose, image, name } = props
  const [classNameBody, setClassNameBody] = useState(false)
  const [classNameHeader, setClassNameHeader] = useState(false)
  const [chatData, setChatData] = useState([])
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')))
  const message = useRef('')

  var key;
  currentUser.id > htmlid? (key = currentUser.id + htmlid) : ( key = htmlid + currentUser.id);
  const dateNow = Date.now();
  const chatRef = firebase
    .database()
    .ref()
    .child("Chats")
    .child(key);
    chatRef.on("child_added", function(snapshot) {
    if (snapshot.val()["numberTime"] > dateNow) {
      var result = {
        key: snapshot.key,
        value: snapshot.val()
      };

      if (!chatData.some(v => v.id === result.key)) {
        let newChat = {
          id: result.key,
          body: {
            idUser: result.value.id_user,
            image: result.value.imageUser,
            nameUser: result.value.nameUser,
            time: result.value.time,
            body: result.value.body
          }
        };
        chatData.unshift(newChat);
        setChatData([...chatData])
      }
    }
  });

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8080/reviewbook/chat/${currentUser.id}/${htmlid}`
    }).then((res) => {
     if(res.data === false) setChatData([])
     else {
       let arr = []
       Object.keys(res.data).map((k) => {
         let value = res.data[k]
          arr.unshift({
            id: k,
            body: {
              idUser: value.id_user,
              image: value.imageUser,
              nameUser: value.nameUser,
              time: value.time,
              body: value.body
            }
          })
       })
       setChatData([...arr])
     }
    })
  }, [])

  const sendChatHandler = (e) => {
    if(e.key === 'Enter'){

      axios({
        method: "post",
        url: `http://localhost:8080/reviewbook/chat?token=${localStorage.getItem('token')}`,
        data: {
          body: message.current.value,
          userIDSend: currentUser.id,
          userIDRReceive: htmlid
        }
      }).then(() => {
        
      })
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