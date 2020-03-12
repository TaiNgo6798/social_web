import React, { useState, useEffect, useContext } from 'react'
import { BellOutlined, HomeOutlined, MailOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Input, Badge, Divider, Tooltip } from 'antd'
import { withRouter } from 'react-router-dom'

import './index.scss'

import Infor from '@components/infor'

import { UserContext } from '../../contexts/userContext'

const { Search } = Input

function Index(props) {
  const [messageCount, setMessageCount] = useState(0)
  const { user: currentUser } = useContext(UserContext)


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
          <div className='home_button'>
            <Tooltip placement="bottom" title='Trang chủ'>
              <HomeOutlined
                className='icon home_icon'
                onClick={() => props.history.push('/newsFeed')} />
            </Tooltip>
          </div>
          <Divider type='vertical' style={{ margin: 0 }} className='home_divider' />
          <Badge count={messageCount} className='icon message_icon'>
            <Tooltip placement="bottom" title='Tin nhắn'>
              <MailOutlined />
            </Tooltip>
          </Badge>
          <Divider type='vertical' style={{ margin: 0 }} className='message_divider' />
          <Badge count={5}>
            <Tooltip placement="bottom" title='Thông báo'>
              <BellOutlined className='icon' />
            </Tooltip>
          </Badge>
          <Divider type='vertical' className='user_icon_divider' style={{ margin: 0 }} />
          {
            currentUser && (
              <>
                <Badge count={0}>
                  <Tooltip placement="bottom" title='Trang cá nhân'>
                    <UserOutlined
                      className='icon user_icon'
                      onClick={() => props.history.push(`/profile/${currentUser._id}`)} />
                  </Tooltip>
                </Badge>
              </>
            )
          }
          <Divider type='vertical' style={{ margin: 0 }} className='search_icon_divider' />
          <SearchOutlined className='icon search_icon' />
        </div>
      </div>
    </div>
  )
}

export default withRouter(Index)