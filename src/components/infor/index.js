import React, { useEffect } from 'react'
import { Avatar } from 'antd'

import SuggestBooks from '../suggestBooks'
// import css
import './index.scss'
import maleUser from '@assets/images/man-user.png'
import femaleUser from '@assets/images/woman-user.png'


const Index = (props) => {

  const { user } = props
  const { firstName, lastName, gender, avatar } = user

  return (
    <>
      <div className='inforForm'>
        <div className='user'>
          <div className='avatar'>
            <Avatar size={45} src={avatar || (gender === 'female' ? femaleUser : maleUser)} />
          </div>
          <div className='username'>
            <h3><i>{firstName ? firstName : ''} {lastName ? lastName : ''}</i></h3>
          </div>
        </div>
        <div className='suggestBooks'>
          <div className='top'>
            Sách gợi ý cho bạn
              <a style={{ float: 'right', paddingRight: '20px' }}>Xem tất cả</a>
          </div>
          <div className='listBooks'>
            <SuggestBooks />
          </div>
        </div>
        <div className='footer'>
          <p>Design and Code by Ngo Thanh Tai</p>
          <p>©2020 Social App</p>
        </div>
      </div>
    </>
  )
}

export default Index