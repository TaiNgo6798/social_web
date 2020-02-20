import React, { useRef, useState } from 'react'
import { Modal, Form, Input, Button, Spin, DatePicker, Select } from 'antd'

// import css
import '../firstRegister/style.scss'

const Index = (props) => {
  const { setCurrentUser } = props
  const { getFieldDecorator } = props.form
  const { Option } = Select
  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY']
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(true)

  const onCancel = () => {
    setVisible(false)
  }
 
  const settingHandler = (e) => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        const { firstname, lastname, gender, phone, birthday } = values
        setLoading(true)
        let birthdayGood = new Date(birthday)
      }
    })
  }


  return (
    <>
      <Modal
        closable = {false}
        maskClosable={!visible}
        visible={visible}
        onCancel={() => { onCancel() }}
        footer={null}
        width='556px'
        className='first-login-form'
      >
        <Spin spinning={loading}>
          <div className='title'>Your information for first login !</div>
          <Form >
            <Form.Item>
              {getFieldDecorator('firstname', {
                rules: [
                  { required: true, message: 'Vui lòng nhập tên của bạn' }
                ]
              })(<Input
                placeholder='Tên và chữ lót'

                size='large'
              />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('lastname', {
                rules: [
                  { required: true, message: 'Vui lòng nhập họ của bạn' }
                ]
              })(<Input
                placeholder='Họ'

                size='large'
              />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('gender', {
                rules: [
                  { required: true, message: 'Vui lòng nhập địa chỉ email' }
                ]
              })(
                <Select
                  placeholder='Giới tính'
                  setfieldvalue="Nam"
                  style={{ width: '100%', fontSize: '18px' }}
                  size={'large'}
                >
                  <Option setfieldvalue="male" key='male'>Nam</Option>
                  <Option setfieldvalue="female" key='female'>Nữ</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('phone', {
                rules: [
                  { required: true, message: 'Vui lòng nhập địa chỉ email' }
                ]
              })(<Input
                placeholder='Số điện thoại'
                size='large'
              />)}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('birthday', {
                rules: [
                  { required: true, message: 'Vui lòng nhập ngày sinh của bạn' }
                ]
              })(<DatePicker
                style={{ width: '100%' }}
                format={dateFormatList}
                placeholder='Ngày sinh'
              />)}
            </Form.Item>

            <Form.Item>
              <Button
                name='btn-send-request'
                type='primary'
                size='large'
                block
                className='btn-innos'
                onClick={(e) => settingHandler(e)}
              >
                Done
            </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

    </>
  )
}

const WrappedNormalForm = Form.create({ name: 'form' })(Index)
export default WrappedNormalForm