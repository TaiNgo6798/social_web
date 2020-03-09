import React, { useEffect } from 'react'
import { Avatar, Tooltip } from 'antd'
// import css
import './index.scss'
import maleUser from '@assets/images/man-user.png'
import femaleUser from '@assets/images/woman-user.png'
import { withRouter } from 'react-router-dom'


const Index = (props) => {

  const { user } = props
  const { firstName, lastName, gender, avatar, _id } = user

  return (
    <Tooltip placement="bottom" title='Trang cá nhân'>
      <div className='infor' onClick={() => props.history.push(`/profile/${_id}`)}>
        <Avatar size={35} src={avatar || (gender === 'female' ? femaleUser : maleUser)} />
        <p>{firstName}</p>
      </div>
    </Tooltip>
  )
}

export default withRouter(Index)