import React, { useState, useEffect } from 'react'
import { Icon, Button, Row, Col } from 'antd'
import { withRouter } from 'react-router-dom'

import axios from 'axios'

import './index.scss'

import EditModal from './editModal'

function Index(props) {
  const { user, setUser } = props
  const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
  const { firstName, lastName, gender, id, birthday, email, image, phone } = currentUser
  const [openEdit, setOpenEdit] = useState(false)
  const { userID } = props.match.params

  return <>
    {openEdit && <EditModal onClose={() => setOpenEdit(false)} currentUser={currentUser} setUser={(data) => setUser(data)}/>}
    <div className='container_detail_profile'>
      <div className='titile_detail_profile'>
        <h1>Giới thiệu</h1>
      </div>

      {/* //thong tin ca nhan */}
      <Row type='flex' justify='space-between'>
        <Col>
          <h2><Icon style={{ fontSize: '22px' }} type="user" />  Thông tin cá nhân</h2>
        </Col>
        <Col>
        {
          currentUser.id === props.match.params.userID &&
          <Button type="dashed" onClick={() => setOpenEdit(true)}><Icon type="edit" />Chỉnh sửa</Button>
        }
        </Col>
      </Row>

      <div className='infor_detail_profile'>
        <hr className='hr_profile' />
        <div className='row_detail_profile'>
          <p>Tên tài khoản</p>
          <p>{`${user.firstName} ${user.secondName}`}</p>
        </div>
        <hr className='hr_profile' />
        <div className='row_detail_profile'>
          <p>Giới tính</p>
          <p>{user.gender}</p>
        </div>
        <hr className='hr_profile' />
        <div className='row_detail_profile'>
          <p>Ngày sinh</p>
          <p>{user.birthday}</p>
        </div>
        <hr className='hr_profile' />
      </div>

      {/* // thong tin lien he */}
      <h2><Icon style={{ fontSize: '22px' }} type="phone" />  Thông tin liên hệ</h2>
      <div className='infor_detail_profile'>
        <hr className='hr_profile' />
        <div className='row_detail_profile'>
          <p>Số điện thoại</p>
          <p>{user.phone}</p>
        </div>
        <hr className='hr_profile' />
        <div className='row_detail_profile'>
          <p>Email</p>
          <p>{user.email}</p>
        </div>

        <hr className='hr_profile' />
      </div>

      {/* // moi quan he */}
      <h2><Icon style={{ fontSize: '22px' }} type="heart" theme='filled' />  Mối quan hệ</h2>
      <div className='infor_detail_profile'>
        <hr className='hr_profile' />
        <div className='row_detail_profile'>
          <p>Tình trạng</p>
          <p>chưa cập nhật</p>
        </div>

        <hr className='hr_profile' />
      </div>

      {/* //cong viec */}
      <h2><Icon style={{ fontSize: '22px' }} type="desktop" />  Công việc và học vấn</h2>
      <div className='infor_detail_profile'>
        <hr className='hr_profile' />
        <div className='row_detail_profile'>
          <p>Trường học</p>
          <p>chưa cập nhật</p>
        </div>
        <hr className='hr_profile' />
        <div className='row_detail_profile'>
          <p>Công ty</p>
          <p>chưa cập nhật</p>
        </div>
        <hr className='hr_profile' />
      </div>
    </div>
  </>
}

export default withRouter(Index)