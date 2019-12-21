import React, { useEffect, useState, useRef } from 'react'
import { Button, Divider, Avatar, Input, Upload, Icon, message, Spin, Modal, Form, Select } from 'antd'
// import css
import './index.scss'
//import firebase
import { uploadStorage } from '../../../firebase/my-firebase'
import axios from 'axios'

//redux
import { useDispatch } from 'react-redux'
import { setUserPost } from '../../../actions/userPost/setUserPost'
import { setPost } from '../../../actions/posts/setPost'

//import HOC
// import withAuthLogged from '../../components/utils/hoc/authLogged'
// import withAuthUser from '../../components/utils/hoc/authUser'
const { Option } = Select
const { TextArea } = Input

const Index = (props) => {
  const { visible, onCancel, currentUser, idPost } = props
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState(props.url)
  const [nameImage, setNameImage] = useState(props.nameImage)
  const [title, setTitle] = useState(props.title)
  const [kind, setKind] = useState(props.kind)
  const [desc, setDesc] = useState(props.desc)
  const [imageUrl, setImageUrl] = useState(props.url)
  const [posting, setPosting] = useState(false)
  const dispatch = useDispatch()
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 4
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }
  const handleChange = async info => {
    if (info.file.status === 'uploading') {
      setImageUrl('')
      setIsLoading(true)
      return
    }
    if (info.file.status === 'done') {
      let img = await uploadStorage(info.file.originFileObj)
      setUrl(img.url)
      setNameImage(img.nameImage)
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setIsLoading(false)
        setImageUrl(imageUrl)
      }
      )
    }
  }

  const uploadButton = (
    <div>
      <Icon type={isLoading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  )

  const savePostHandler = () => {
    window.document.querySelector('.text').value = ''
    window.document.querySelector('[name="title"]').value = ''
    setPosting(true)
    axios({
      method: 'put',
      url: `http://localhost:8080/reviewbook/review/post/own/${currentUser.id}/${idPost}?token=${localStorage.getItem('token')}`,
      data: {
        nameImage,
        desc,
        url,
        title,
        kind
      }
    }).then(() => {
      if (props.params) {
        axios({
          method: 'get',
          url: `http://localhost:8080/reviewbook/review/post/own/${props.params.userID}`,
        }).then((res) => {
          dispatch(setUserPost(res.data))
          setPosting(false)
        })
      } else {
        axios({
          method: 'get',
          url: `http://localhost:8080/reviewbook/review/post`,
        }).then((res) => {
          dispatch(setPost(res.data))
          setPosting(false)
        })
      }
      onCancel()
    })

  }

  return (
    <>
      <Modal
        visible={visible}
        onCancel={() => onCancel()}
        footer={null}
        width='556px'
        className='edit-form'

      >
        <Spin spinning={posting}>
          <div className='editForm'>
            <Spin tip="Đang lưu ..."
              spinning={false}
            >
              <div className='top-bar'>
                <h3 style={{ marginBottom: 0 }}>Sửa bài viết</h3>
                <a className='close-button' style={{ marginRight: 'auto', marginBottom: 0, float: 'right' }}>x</a>
              </div>
              <Divider style={{ margin: '10px 0 20px 0' }} />
              <div className='main'>
                <TextArea
                  setfieldvalue={'desc'}
                  className='text'
                  placeholder={desc}
                  autoSize={{ minRows: 1, maxRows: 50 }}
                  style={{ borderColor: 'transparent', fontSize: '18px' }}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              <div className='bottom-bar'>
                <div className='tool-bar'>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                  <div className='input-form'>
                    <p style={{ marginBottom: '5px', color: '#B8BCBC' }}>Dòng này được thêm vào cho đỡ trống ...</p>
                    <Input placeholder='Tiêu đề...'
                      onChange={(e) => setTitle(e.target.value)}
                      setfieldvalue={title}
                      name='title' />
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Chọn thể loại ..."
                      optionFilterProp="children"
                      onChange={(e) => setKind(e)}
                    >
                      <Option value="Văn học">Văn học</Option>
                      <Option value="Tiểu thuyết">Tiểu thuyết</Option>
                      <Option value="Truyện ngắn">Truyện ngắn</Option>
                    </Select>
                  </div>
                </div>
                {
                  !isLoading && (
                    <Button type='primary' style={{ display: 'block', width: '100%' }} onClick={() => savePostHandler()}>Lưu</Button>
                  )
                }
              </div>
            </Spin>
          </div>
        </Spin>
      </Modal>

    </>
  )
}

export default Index