import React, { useEffect, useState, useRef } from 'react'
import { Button, Divider, Avatar, Input, Upload, Icon, message, Spin, Select } from 'antd'
// import css
import './index.scss'
//import firebase
import { uploadStorage } from '../../firebase/my-firebase'
import axios from 'axios'

//redux
import { useDispatch } from 'react-redux'
import { setUserPost } from '../../actions/userPost/setUserPost'
import { setPost } from '../../actions/posts/setPost'

//import HOC
import withAuthLogged from '../../components/utils/hoc/authLogged'
import withAuthUser from '../../components/utils/hoc/authUser'

const { Option } = Select

const { TextArea } = Input

const Index = (props) => {
  const { user } = props
  const { image } = user
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [url, setUrl] = useState('')
  const [nameImage, setNameImage] = useState('')
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState('')
  const [desc, setDesc] = useState('')
  const [posting, setPosting] = useState(false)
  const [ready, setReady] = useState(false)

  //redux
  const dispatch = useDispatch()


  const onSubmitPost = () => {
    window.document.querySelector('.text').value = ''
    window.document.querySelector('[name="title"]').value = ''
    const closeBtn = window.document.querySelector('.close-button')
    setPosting(true)
    axios({
      method: 'post',
      url: `http://localhost:8080/reviewbook/review/post?token=${localStorage.getItem('token')}`,
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
          dispatch(setUserPost({}))
          dispatch(setUserPost(res.data))
          setPosting(false)
          setDesc('')
          closeBtn.click()
          setImageUrl('')
          setUrl('')
          setTitle('')
          setKind('')
        })
      } else {
        axios({
          method: 'get',
          url: `http://localhost:8080/reviewbook/review/post`,
        }).then((res) => {
          dispatch(setPost({}))
          dispatch(setPost(res.data))
          setPosting(false)
          setDesc('')
          closeBtn.click()
          setImageUrl('')
          setUrl('')
          setTitle('')
          setKind('')
        })
      }
    })

  }

  useEffect(() => {
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
        }, 300);
      }

    })

    postEditor.addEventListener('focus', () => {
      createPostForm.setAttribute('style', 'z-index: 11')
      body.classList.add('show-fake-body')
      setTimeout(() => {
        window.document.querySelector('.bottom-bar').classList.add('show-from-post-component')
        closeBtn.classList.add('show-from-post-component')
        body.classList.add('modal-active')
      }, 1);


    })
    closeBtn.addEventListener('click', () => {
      createPostForm.setAttribute('style', 'z-index: 8')
      window.document.querySelector('.bottom-bar').classList.remove('show-from-post-component')
      closeBtn.classList.remove('show-from-post-component')
      body.classList.remove('modal-active')
      setTimeout(() => {
        body.classList.remove('show-fake-body')
      }, 300);
    }
    )
  }, [])


  const handleChange = async info => {
    if (info.file.status === 'uploading') {
      setReady(false)
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
        setReady(true)
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
  );

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
            <Avatar size={45} src={image ? image : ''} />
            <TextArea
              setfieldvalue={desc}
              className='text'
              placeholder="Bạn có đang muốn chia sẻ cuốn sách nào không ?"
              autoSize={{ minRows: 1, maxRows: 50 }}
              style={{ borderColor: 'transparent', fontSize: '18px' }}
              onChange={(e) => setDesc(e.target.value)}
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
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
              <div className='input-form'>
                <p style={{ marginBottom: '5px', color: '#B8BCBC' }}>Dòng này được thêm vào cho đỡ trống ...</p>
                <Input placeholder='Tiêu đề...' onChange={(e) => setTitle(e.target.value)} setfieldvalue={title} name='title' />
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