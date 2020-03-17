import React, { useState, useContext } from 'react'
import '@ant-design/compatible/assets/index.css'

import { Form, Input, Select, Button, Spin, notification } from 'antd'

import { withRouter } from 'react-router-dom'
//server
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
// import css
import './index.scss'
import { UserContext } from '../../contexts/userContext'

const REGISTER = gql`
  mutation createUser($user: UserInput!) {
    createUser(user: $user)
  }
`

function RegistrationForm(props) {
  const [form] = Form.useForm()
  const [register] = useMutation(REGISTER)
  const [loading, setLoading] = useState(false)

  const openNotification = status =>
    status
      ? notification.success({
          message: 'Đăng kí thành công !',
          placement: 'bottomRight',
        })
      : notification.error({
          message: 'Email đã tồn tại !',
          placement: 'bottomRight',
        })

  const handleSubmit = values => {
    setLoading(true)
    const { email, password, firstName, lastName, gender } = values
    register({
      variables: {
        user: {
          email,
          password,
          firstName,
          lastName,
          gender,
        },
      },
    })
      .then(res => {
        setLoading(false)
        openNotification(res.data.createUser)
        if (res.data.createUser) {
          props.history.push('/login')
        }
      })
      .catch(err => {
        setLoading(false)
        notification.error({
          message: 'Đăng kí không thành công !',
          placement: 'bottomRight',
        })
      })
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  }

  const registerForm = (
    <Form
      size="middle"
      style={{ width: '35em' }}
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={handleSubmit}
      scrollToFirstError
    >
      <Form.Item
        label="Họ tên"
        style={{ marginBottom: 0 }}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Form.Item
          style={{
            display: 'inline-block',
            width: 'calc(50% - 5px)',
            marginRight: 8,
          }}
          name="firstName"
          rules={[
            {
              required: true,
              message: 'Vui lòng điền họ của bạn !',
            },
          ]}
        >
          <Input placeholder="Họ" />
        </Form.Item>
        <Form.Item
          style={{ display: 'inline-block', width: 'calc(50% - 5px)' }}
          name="lastName"
          rules={[
            {
              required: true,
              message: 'Vui lòng điền tên của bạn !',
            },
          ]}
        >
          <Input placeholder="Tên" />
        </Form.Item>
      </Form.Item>

      <Form.Item
        name="gender"
        label="Giới tính"
        rules={[
          {
            required: true,
            message: 'Vui lòng chọn giới tính !',
          },
        ]}
      >
        <Select placeholder="Giới tính">
          <Select.Option value="male">Nam</Select.Option>
          <Select.Option value="female">Nữ</Select.Option> 
        </Select>
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
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
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Mật khẩu"
        rules={[
          {
            required: true,
            message: 'Vui lòng điền mật khẩu !',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Xác nhận mật khẩu"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Vui lòng xác nhận mật khẩu !',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject('Xác nhận mật khẩu không đúng !')
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <div className="bottom-button">
        <Button type="dash" onClick={() => props.backLogin()}>
          Về trang đăng nhập
        </Button>
        <Button type="primary" htmlType="submit">
          Đăng kí
        </Button>
      </div>
    </Form>
  )

  return (
    <>
      <h1 style={{ display: 'block', textAlign: 'center' }}>Đăng kí</h1>
      <Spin spinning={loading}>{registerForm}</Spin>
    </>
  )
}

export default withRouter(RegistrationForm)
