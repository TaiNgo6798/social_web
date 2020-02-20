import React, { useState } from 'react'
import {
  Form,
  Input,
  Button,
  Spin,
  notification
} from 'antd'
import Swal from 'sweetalert2'
import { withRouter } from 'react-router-dom'
//server
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
// import css
import './index.scss'

const REGISTER = gql`
mutation createUser($user: UserInput!) {
  createUser(user: $user)
}
`


function RegistrationForm(props) {
  const [register] = useMutation(REGISTER)
  const [confirmDirty, setConfirmDirty] = useState(false)
  const [loading, setLoading] = useState(false)

  const openNotification = (status) => status ? (
    notification.success({
      message: 'Đăng kí thành công !',
      placement: 'bottomRight'
    })
  ) : (
    notification.error({
      message: 'Email đã tồn tại !',
      placement: 'bottomRight'
    })
  )

  const handleSubmit = e => {
    e.preventDefault()

    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoading(true)
        const { email, password, firstName, lastName } = values
        register({
          variables: {
            user: {
              email,
              password,
              firstName,
              lastName
            }
          }
        }).then((res) => {
          setLoading(false)
          openNotification(res.data.createUser)
          if(res.data.createUser)
          props.history.push('/login')
        }).catch((err) => {
            Swal.fire({
              position: 'center',
              type: 'error',
              title: err,
              showConfirmButton: true,
              timer: 1500
            })
        })
      }
    })
  }

  const handleConfirmBlur = e => {
    const { value } = e.target
    setConfirmDirty(confirmDirty || !!value)
  }

  const compareToFirstPassword = (rule, value, callback) => {
    const { form } = props
    if (value && value !== form.getFieldValue('password')) {
      callback('Xác nhận mật khẩu không đúng !')
    } else {
      callback()
    }
  }

  const validateToNextPassword = (rule, value, callback) => {
    const { form } = props
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }


  const { getFieldDecorator } = props.form

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


  return (
    <Spin spinning={loading}>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Họ" className='registerForm'>
          {getFieldDecorator('firstName', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập Họ !',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Tên" className='registerForm'>
          {getFieldDecorator('lastName', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập Tên !',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="E-mail" className='registerForm'>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'Địa chỉ E-mail không hợp lệ !',
              },
              {
                required: true,
                message: 'Vui lòng nhập địa chỉ E-mail !',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Mật khẩu" hasFeedback className='registerForm'>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu !',
              },
              {
                validator: validateToNextPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Xác nhận mật khẩu" hasFeedback className='registerForm'>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Vui lòng xác nhận mật khẩu !',
              },
              {
                validator: compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={handleConfirmBlur} />)}
        </Form.Item>
        <Button type='primary' className='btnRegister' htmlType='submit'>Đăng kí</Button>
        <Button className='btnBackLogin' onClick={() => { props.backLogin() }}>Về trang đăng nhập</Button>
      </Form>
    </Spin>

  )
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm)

export default withRouter(WrappedRegistrationForm)