import React, { useState } from 'react'
import {
  Form,
  Input,
  Button,
  Spin
} from 'antd';
import Swal from 'sweetalert2'
import { withRouter } from 'react-router-dom'
//server
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
// import css
import './index.scss'

const REGISTER = gql`
mutation createUser($input: UserInput!) {
  createUser(input: $input){
    id
    name
    email
    age
  }
}
`


function RegistrationForm(props) {
  const [register] = useMutation(REGISTER)
  const [confirmDirty, setConfirmDirty] = useState(false)
  const [autoCompleteResult, setAutoCompleteResult] = useState([])
  const [loading, setLoading] = useState(false)


  const handleSubmit = e => {
    e.preventDefault();

    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoading(true)
        register({
          variables: {
            input: {
              name: 'new',
              age: 0,
              email: values.email,
              password: values.password
            }
          }
        }).then((res) => {
          setLoading(false)
          console.log(res)
          Swal.fire({
            position: 'center',
            type: 'success',
            title: 'Đăng kí thành công !',
            showConfirmButton: false,
            timer: 1000
          })
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
    });
  };

  const handleConfirmBlur = e => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value)
  };

  const compareToFirstPassword = (rule, value, callback) => {
    const { form } = props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    const { form } = props;
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  const handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    setAutoCompleteResult(autoCompleteResult)
  };

  const { getFieldDecorator } = props.form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };


  return (
    <Spin spinning={loading}>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
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

  );
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

export default withRouter(WrappedRegistrationForm)