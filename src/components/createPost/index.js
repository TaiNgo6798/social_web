import React, { useEffect, useState, useRef, useContext } from 'react'
import { Button, Divider, Avatar, Input, Upload, Icon, message, Spin, Select, notification } from 'antd'
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
mutation add($content:String!, $image: String!){
  addPost(post: {content: $content, image: $image}){
    _id
    who{
      email
      firstName
      lastName
      _id
    }
    image
    content
    time
    likes{
      who{
        email
      }
    }
  }
}
`

const Index = (props) => {
  const { user } = props
  const { avatar, gender } = user
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)
  const [ready, setReady] = useState(false)
  const [image, setImage] = useState(null)
  const [addPost] = useMutation(ADD_POST)
  const {setAddPostData} = useContext(PostContext)

  const onSubmitPost = () => {
    window.document.querySelector('.text').value = ''
    setPosting(true)
    let formData = new FormData()
    formData.append('image', image)
    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    }
    const url = 'http://localhost:14377/file/upload?type=post'
    axios.post(url, formData, config)
      .then(res => {
        addPost({variables:{
          content,
          image: res.data
        }}).then((res) => {
          setPosting(false)
          if(res.data.addPost) {
            setContent('')
            setImageUrl('')
            setImage(null)
            setAddPostData(res.data.addPost)
            notification.success({
              message: 'Tạo xong  !',
              placement: 'bottomRight'
            })
          } else {
            notification.error({
              message: 'Đăng bài không thành công !',
              placement: 'bottomRight'
            })
          }
          turnOFFmodal()
        }).catch(err => console.log(err))
      })
      .catch(error => {
        console.log(error)
      })
  }

  const turnOFFmodal = () => {
    const createPostForm = window.document.querySelector('.createPostForm')
    const body = window.document.querySelector('.body-fake')
    const closeBtn = window.document.querySelector('.close-button')
    
    createPostForm.setAttribute('style', 'z-index: 8')
    window.document.querySelector('.bottom-bar').classList.remove('show-from-post-component')
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
          body.classList.remove('modal-active')
          window.document.querySelector('.bottom-bar') && window.document.querySelector('.bottom-bar').classList.remove('show-from-post-component')
          closeBtn.classList.remove('show-from-post-component')
          window.document.activeElement.blur()
          setTimeout(() => {
            body.classList.remove('show-fake-body')
          }, 300)
        }
      })
      postEditor.addEventListener('focus', () => {
        createPostForm.setAttribute('style', 'z-index: 11')
        body.classList.add('show-fake-body')
        setTimeout(() => {
          window.document.querySelector('.bottom-bar').classList.add('show-from-post-component')
          closeBtn.classList.add('show-from-post-component')
          body.classList.add('modal-active')
        }, 1)
      })
      closeBtn.addEventListener('click', () => {
        turnOFFmodal()
      }
      )
    }
    return () => { mounted = false }
  }, [])


  const handleChange = async info => {
    if (info.file.status === 'uploading') {
      setImageUrl('')
      setReady(false)
      setIsLoading(true)
    }
    if (info.file.status === 'done') {setReady
      getBase64(info.file.originFileObj, imageUrl => {
        setIsLoading(false)
        setImageUrl(imageUrl)
        setReady(true)
        setImage(info.file.originFileObj)
      }
      )
    }
  }

  const beforeUpload = (file) => {
    message.config({
      top: '90%'
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

  const closeFormHandler = () => {
    const closeBtn = window.document.querySelector('.close-button')
    closeBtn.click()
  }

  const uploadButton = (
    <div>
      <Icon type={isLoading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  )

  return (
    <>
      <div className='body-fake' onClick={() => closeFormHandler()}></div>
      <div className='createPostForm'>
        <Spin tip="Đang đăng bài ..."
          spinning={posting}
        >
          <div className='top-bar'>
            <h3 style={{ marginBottom: 0 }}>Đăng bài</h3>
            <a className='close-button' style={{ marginRight: 'auto', marginBottom: 0, float: 'right' }}>x</a>
          </div>
          <Divider style={{ margin: '10px 0 20px 0' }} />
          <div className='main'>
            <Avatar size={45} src={avatar || (gender === 'female' ? femaleUser : maleUser)} />
            <TextArea
              value={content}
              className='text'
              placeholder="Bạn có đang muốn chia sẻ cuốn sách nào không ?"
              autoSize={{ minRows: 1, maxRows: 50 }}
              style={{ borderColor: 'transparent', fontSize: '18px' }}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          {/* <Divider style={{marginBottom: '15px'}}/> */}
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
                {imageUrl.length > 0 ? <img src={imageUrl} style={{ width: '100%' }} /> : uploadButton}
              </Upload>
            </div>
            {
              ready && (
                <Button type='primary' style={{ display: 'block', width: '100%' }} onClick={onSubmitPost}>Đăng</Button>
              )
            }
          </div>
        </Spin>
      </div>

    </>
  )
}

export default withAuthLogged(withAuthUser(Index))