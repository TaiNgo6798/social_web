import React, { useState, useEffect, useContext } from 'react'
import { Input, Badge, Icon, Divider } from 'antd'
import { withRouter } from 'react-router-dom'

import './index.scss'

import Infor from '@components/infor'

import { UserContext } from '../../contexts/userContext'

const { Search } = Input

function Index(props) {
  const [messageCount, setMessageCount] = useState(0)
  const { user: currentUser } = useContext(UserContext)

  let heightChange = true
  const loadNotify = () => {
    setInterval(() => {
      setMessageCount(messageCount => messageCount + 1)
    }, 10000)
  }
  useEffect(() => {

    let mounted = true
    if (mounted) {
      //loadNotify()
      window.addEventListener('scroll', () => {
        if (window.scrollY >= 50 && heightChange === true) {
          window.document.querySelector('.inforForm') && window.document.querySelector('.inforForm').classList.add('fixedPos')
          heightChange = false
        }
        if (window.scrollY <= 50 && heightChange === false) {
          window.document.querySelector('.inforForm') && window.document.querySelector('.inforForm').classList.remove('fixedPos')
          heightChange = true
        }
      })
    }
    return () => { mounted = false }
  }, [])

  const searchHandler = (value) => {

  }

  return (
    <div className='nav'>
      <div className='container'>
        <div className='logo' onClick={() => props.history.push('/newsFeed')}></div>
        <div className='searchBar'>
          <Search
            placeholder="input search text"
            onSearch={value => searchHandler(value)}
            style={{ width: '100%' }}
          />
        </div>
        <div className='iconTop'>
          <Infor user={currentUser ? currentUser : { image: '', firstName: 'anonymous' }} />
          {/* <Icon type="text" className='icon' /> */}
          <Badge count={messageCount} className='icon message_icon'>
            <Icon type="mail"  />
          </Badge>
          <Divider type='vertical' style={{margin: 0}} className='message_divider' />
          <Badge count={5}>
            <Icon type="bell" className='icon' />
          </Badge>
          <Divider type='vertical' style={{margin: 0}}/>
          {
            currentUser && (
              <>
              <Badge count={0}>
                <Icon type="user" className='icon' onClick={() => props.history.push(`/profile/${currentUser._id}`)} />
              </Badge>
            </>
            )
          }
          <Divider type='vertical' style={{margin: 0}} className='search_icon_divider'/>
          <Icon type="search" className='icon search_icon' />
        </div>
      </div>
    </div>
  )
}

export default withRouter(Index)