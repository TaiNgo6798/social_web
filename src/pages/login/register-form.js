import React, { useState } from 'react'
import {
  Form,
  Input,
  Button,
  Spin
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

          Swal.fire({
            position: 'center',
            type: res.data.createUser ? 'success' : 'error',
            title: res.data.createUser ? 'Đăng kí thành công !' : 'Email da duoc dang ki !',
            showConfirmButton: false,
            timer: 1000
          })
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
      callback('Two passwords that you enter is inconsistent!')
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
        <Form.Item label="First Name" className='registerForm'>
          {getFieldDecorator('firstName', {
            rules: [
              {
                required: true,
                message: 'Please input your First Name !',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Last Name" className='registerForm'>
          {getFieldDecorator('lastName', {
            rules: [
              {
                required: true,
                message: 'Please input your LastName !',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="E-mail" className='registerForm'>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Password" hasFeedback className='registerForm'>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: validateToNextPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback className='registerForm'>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={handleConfirmBlur} />)}
        </Form.Item>
        <Button type='primary' className='btnRegister' htmlType='submit'>Register</Button>
        <Button className='btnBackLogin' onClick={() => { props.backLogin() }}>Back to login</Button>
      </Form>
    </Spin>

  )
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm)

export default withRouter(WrappedRegistrationForm)