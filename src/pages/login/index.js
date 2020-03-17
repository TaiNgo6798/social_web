import React, { useRef, useState, useEffect, useContext } from 'react'
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons'
import { Form, Input, Button, Spin, notification } from 'antd'
import { withRouter } from 'react-router-dom'

import RegisterForm from './register-form'
import ForgotForm from './forgot-form'

// import css
import './index.scss'

import background from '@assets/images/login_wallpaper.jpg'

//server
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { UserContext } from '../../contexts/userContext'

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      token
      status
      message
    }
  }
`
const openNotification = placement => {
  notification.error({
    message: 'Sai tài khoản hoặc mật khẩu !',
    placement,
  })
}

const Index = props => {
  const { history } = props
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const [forgotForm, setForgotForm] = useState(false)
  const [login] = useMutation(LOGIN)
  const [loading, setLoading] = useState(false)
  const { refreshUser } = useContext(UserContext)

  const registerClick = () => {
    const loginForm = window.document.querySelector('.login')
    loginForm.classList.toggle('hide_login')
    const registerForm = window.document.querySelector('.register')
    registerForm.classList.toggle('show_register')
  }

  const handleSubmit = () => {
        setLoading(true)
        login({
          variables: {
            email: emailRef.current.state.value,
            password: passwordRef.current.state.value,
          },
        })
          .then(res => {
            setLoading(false)
            const { token } = res.data.login
            if (token) {
              localStorage.setItem('Authorization', `Bearer ${token}`)
              refreshUser()
              history.push('/newsFeed')
            } else {
              openNotification('bottomRight')
            }
          })
          .catch(err => {
            setLoading(false)
            notification.error({
              message: 'Không thể đăng nhập lúc này !',
              placement: 'bottomRight',
            })
          })
  }


  const loginForm = (
    <Form name="normal_login" className="login-form" onFinish={handleSubmit}>
      <Form.Item
        name="email"
        rules={[
          {
            type: 'email',
            message: 'Email không hợp lệ !',
          },
          {
            required: true,
            message: 'Vui lòng nhập E-mail !',
          },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="Email"
          ref={emailRef}
        />
      </Form.Item>
      <Form.Item
      style={{marginBottom: '0.25em'}}
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu !' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Mật khẩu"
          ref={passwordRef}
        />
      </Form.Item>
      <Form.Item style={{marginBottom: '1em'}}>
        <a className="login-form-forgot" onClick={() => setForgotForm(true)} style={{float: 'right'}}>
          Quên mật khẩu
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" style={{marginBottom: '0.5em'}}>
          Đăng nhập
        </Button>
        Hoặc <a onClick={() => registerClick()}>đăng kí ngay !</a>
      </Form.Item>
    </Form>
  )

  return (
    <div className="login_container">
      <img className="login_background" src={background}></img>
      <div className="form-center login">
        <div className="login_form_body">
          <h1 style={{ display: 'block', textAlign: 'center' }}>Đăng nhập</h1>
          <Spin spinning={loading}>{loginForm}</Spin>
        </div>
      </div>
      <div className="form-center register">
        <RegisterForm backLogin={() => registerClick()} />
      </div>
      <ForgotForm onCancel={() => setForgotForm(false)} visible={forgotForm} />
    </div>
  )
}

export default withRouter(Index)
