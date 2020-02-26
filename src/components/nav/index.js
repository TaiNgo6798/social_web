import React, { useState, useEffect, useContext } from 'react'
import { Input, Badge, Icon } from 'antd'
import { withRouter } from 'react-router-dom'

import './index.scss'

import  { UserContext }  from '../../contexts/userContext' 

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
    if(mounted) {
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
    return () => {mounted = false}
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
              style={{ width: 200 }}
            />
            </div>
            <div className='notify'>
              <Badge count={messageCount}>
                <Icon type="mail" className='icon' />
              </Badge>
              <Badge count={5}>
                <Icon type="bell" className='icon' />
              </Badge>
              {
                currentUser && (
                  <Badge count={0}>
                    <Icon type="user" className='icon' onClick={() => props.history.push(`/profile/${currentUser._id}`)} />
                  </Badge>
                )
              }

            </div>
          </div>
        </div>
  )
}

export default withRouter(Index)