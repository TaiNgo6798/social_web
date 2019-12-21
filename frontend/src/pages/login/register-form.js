import React from 'react'
import {
  Form,
  Input,
  Button,
  Spin
} from 'antd';
import Swal from 'sweetalert2'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
// import css
import './index.scss'


class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    loading: false
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({loading: true})
        axios({
          method: 'post',
          url: 'http://localhost:8080/reviewbook/register',
          data: {
            email: values.email,
            password: values.password
          }
        }).then((res) => {
          this.setState({loading: false})
          if (res.data.success) {
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Đăng kí thành công !',
              showConfirmButton: false,
              timer: 1000
            })
            this.props.history.push('/login')
          } else {
            Swal.fire({
              position: 'center',
              type: 'error',
              title: res.data,
              showConfirmButton: true,
              timer: 1500
            })
          }
        })
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

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
      <Spin spinning={this.state.loading}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
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
                  validator: this.validateToNextPassword,
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
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
          <Button type='primary' className='btnRegister' htmlType='submit'>Register</Button>
          <Button className='btnBackLogin' onClick={() => { this.props.backLogin() }}>Back to login</Button>
        </Form>
      </Spin>

    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

export default withRouter(WrappedRegistrationForm)