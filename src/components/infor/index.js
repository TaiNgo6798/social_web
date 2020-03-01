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
    <div className='infor'>
        <Avatar size={35} src={avatar || (gender === 'female' ? femaleUser : maleUser)} />
  <p>{firstName}</p>
    </div>
  )
}

export default Index