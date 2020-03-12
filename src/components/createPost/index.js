import React, { useEffect, useState, useRef, useContext } from 'react'
import {
  Button,
  Divider,
  Avatar,
  Input,
  Upload,
  Icon,
  message,
  Spin,
  Modal,
  notification,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
// import css
import './index.scss'

//import HOC
import withAuthLogged from '../../components/utils/hoc/authLogged'
import withAuthUser from '../../components/utils/hoc/authUser'

import maleUser from '@assets/images/man-user.png'
import femaleUser from '@assets/images/woman-user.png'
import axios from 'axios'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

//context
import { PostContext } from '@contexts/postContext'

const { TextArea } = Input
const ADD_POST = gql`
  mutation add($content: String!, $image: ImageInput) {
    addPost(post: { content: $content, image: $image }) {
      _id
      who {
        email
        firstName
        lastName
        _id
      }
      image {
        id
        url
      }
      content
      time
      likes {
        who {
          email
        }
      }
    }
  }
`

const Index = props => {
  const notify = (text, code) => {
    code === 1
      ? notification.success({
          message: text,
          placement: 'bottomRight',
        })
      : notification.error({
          message: text,
          placement: 'bottomRight',
        })
  }
  const { user } = props
  const { avatar, gender, firstName } = user
  const { setAddPostData } = useContext(PostContext)
  const [addPost] = useMutation(ADD_POST)

  const [imageUrl, setImageUrl] = useState('')
  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)
  const [ready, setReady] = useState(false)
  const [image, setImage] = useState(null)
  const [isUploadImage, setIsUploadImage] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewVisible, setPreviewVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (image || content.length > 0) {
      !ready && setReady(true)
    } else {
      ready && setReady(false)
    }
  }, [content])

  const upLoadToDrive = () => {
    let formData = new FormData()
    formData.append('image', image)
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
    }
    const url = 'http://localhost:14377/file/upload?type=post'
    return axios.post(url, formData, config)
  }

  const onSubmitPost = async () => {
    window.document.querySelector('.text').value = ''
    if (image || content) {
      setPosting(true)
      let newImage = null
      if (image) {
        const upload = await upLoadToDrive()
        newImage = upload.data
      }
      addPost({
        variables: {
          content,
          image: newImage || { id: '', url: '' },
        },
      })
        .then(res => {
          if (res.data.addPost) {
            setAddPostData(res.data.addPost)
            notify('Tạo xong !', 1)
          } else {
            notify('Đăng bài không thành công !', 2)
          }
          setContent('')
          setImageUrl('')
          setImage(null)
          setReady(false)
          setIsUploadImage(false)
          turnOFFmodal()
        })
        .catch(err => {
          notify('Đăng bài không thành công !', 2)
          turnOFFmodal()
        })
    }
  }

  const turnOFFmodal = () => {
    setPosting(false)
    const createPostForm = window.document.querySelector('.createPostForm')
    const body = window.document.querySelector('.body-fake')
    const closeBtn = window.document.querySelector('.close-button')
    createPostForm.setAttribute('style', 'z-index: 8')
    window.document
      .querySelector('.bottom-bar')
      .classList.remove('show-from-post-component')
    closeBtn.classList.remove('show-from-post-component')
    body.classList.remove('modal-active')
    setTimeout(() => {
      body.classList.remove('show-fake-body')
    }, 300)
  }

  useEffect(() => {
    let mounted = true
    if (mounted) {
      const postEditor = window.document.querySelector('.text')
      const closeBtn = window.document.querySelector('.close-button')
      const body = window.document.querySelector('.body-fake')
      const createPostForm = window.document.querySelector('.createPostForm')

      window.document.addEventListener('scroll', () => {
        if (window.scrollY >= 350) {
          turnOFFmodal()
        }
      })
      postEditor.addEventListener('focus', () => {
        createPostForm.setAttribute('style', 'z-index: 11')
        body.classList.add('show-fake-body')
        setTimeout(() => {
          window.document
            .querySelector('.bottom-bar')
            .classList.add('show-from-post-component')
          closeBtn.classList.add('show-from-post-component')
          body.classList.add('modal-active')
        }, 1)
      })
      closeBtn.addEventListener('click', () => {
        turnOFFmodal()
      })
    }
    return () => {
      mounted = false
    }
  }, [])

  const handleChange = async info => {
    if (info.file.status === 'uploading') {
      setImageUrl('')
      setReady(false)
      setIsLoading(true)
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        setIsLoading(false)
        setImageUrl(imageUrl)
        setReady(true)
        setImage(info.file.originFileObj)
      })
    }
  }

  const beforeUpload = file => {
    message.config({
      top: '90%',
    })
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 4
    if (!isLt2M) {
      message.error('Image must smaller than 4MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const handlePreview = () => {
    setPreviewImage(imageUrl)
    setPreviewVisible(true)
  }

  const closeFormHandler = () => {
    const closeBtn = window.document.querySelector('.close-button')
    closeBtn.click()
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  )

  const addImageButton = (
    <div className="add_image_button" onClick={() => setIsUploadImage(true)}>
      <Icon type="camera" style={{ fontSize: 20 }} />
      <p>Ảnh</p>
    </div>
  )

  return (
    <>
      <div className="body-fake" onClick={() => closeFormHandler()}></div>
      <div className="createPostForm">
        <Spin tip="Đang đăng bài ..." spinning={posting}>
          <div className="top-bar">
            <h3 style={{ marginBottom: 0 }}>Đăng bài</h3>
            <a
              className="close-button"
              style={{ marginRight: 'auto', marginBottom: 0, float: 'right' }}
            >
              x
            </a>
          </div>
          <Divider style={{ margin: '10px 0 20px 0' }} />
          <div className="main">
            <Avatar
              size={45}
              src={avatar || (gender === 'female' ? femaleUser : maleUser)}
            />
            <TextArea
              value={content}
              className="text"
              placeholder={`${firstName.split(' ')[0]}, bạn đang nghĩ gì ?`}
              autoSize={{ minRows: 1, maxRows: 50 }}
              style={{ borderColor: 'transparent', fontSize: '18px' }}
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <div className="bottom-bar">
            <div className="tool-bar">
              {isUploadImage ? (
                <div className="clearfix">
                  <Upload
                    listType="picture-card"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    onPreview={handlePreview}
                    onRemove={() => {
                      setImage(null)
                      setImageUrl('')
                    }}
                  >
                    {imageUrl.length > 0 ? (
                      <img src={imageUrl} style={{ width: '100%' }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={() => setPreviewVisible(false)}
                  >
                    <img
                      alt="example"
                      style={{ width: '100%' }}
                      src={previewImage}
                    />
                  </Modal>
                </div>
              ) : (
                addImageButton
              )}
            </div>
            {ready && (
              <Button
                type="primary"
                style={{ display: 'block', width: '100%' }}
                onClick={onSubmitPost}
              >
                Đăng
              </Button>
            )}
          </div>
        </Spin>
      </div>
    </>
  )
}

export default withAuthLogged(withAuthUser(Index))
