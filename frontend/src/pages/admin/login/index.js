import React, { useState, useEffect } from 'react'
import { Form, Icon, Input, Button } from 'antd'

import './index.scss'

import axios from 'axios'
import Swal from 'sweetalert2'

function Index(props) {
  const { checkAccount } = props
  const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = props.form
  // Only show error after a field is touched.
  const usernameError = isFieldTouched('username') && getFieldError('username')
  const passwordError = isFieldTouched('password') && getFieldError('password')

  const hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field])
  }

  useEffect(() => {
    props.form.validateFields()
  }, [])


  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        axios({
          method: 'post',
          url: 'http://localhost:8080/reviewbook/login',
          data: {
            email: values.username,
            password: values.password
          }
        }).then(async function (res) {
          if (res.data.token || res.data.success === true) {
            localStorage.setItem('idAdmin', Object.keys(res.data)[0])
            localStorage.setItem('tokenAdmin', Object.values(res.data)[1])
            checkAccount()
          } else {
            Swal.fire({
              position: 'center',
              type: 'error',
              title: res.data,
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
      }
    })
  }


  return (
    <>
      <div className='form_login_admin'>
        <h1>Login to Admin's page</h1>
        <Form  onSubmit={(e) => handleSubmit(e)}>
          <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />,
            )}
          </Form.Item>
          <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
              Log in
          </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(Index)
export default WrappedHorizontalLoginForm