import React, { useState, useEffect } from 'react'
import { Skeleton, Empty, Avatar, Tabs, Tag, Button, Upload, message, Spin, Tooltip } from 'antd'
import { books } from 'react-icons-kit/icomoon/books'
import { Icon } from 'react-icons-kit'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
//import components
import DetailProfile from './inforTab'
import Post from '../../components/post'
import CreatePost from '../../components/createPost'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
// import css
import './index.scss'

//firebase
import { uploadStorage } from '../../firebase/my-firebase'

//import redux
import { useSelector, useDispatch } from 'react-redux'
import { setUserPost } from '../../actions/userPost/setUserPost'

const { TabPane } = Tabs

function Index(props) {
  const [loading, setLoading] = useState(true)
  const [loadingAva, setLoadingAva] = useState(false)
  const [postList, setPostList] = useState([])
  const [user, setUser] = useState({})
  const [profileKey, setProfileKey] = useState('1')
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')))
  //redux
  const posts = useSelector(state => state.userPostReducer)
  const dispatch = useDispatch()
  const { userID } = props.match.params

  var heightChange = true

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 440 && heightChange === true) {
        window.document.querySelector('.infor_profile') && window.document.querySelector('.infor_profile').classList.add('fixedPos_profile')
        heightChange = false
      }
      if (window.scrollY <= 440 && heightChange === false) {
        window.document.querySelector('.infor_profile') && window.document.querySelector('.infor_profile').classList.remove('fixedPos_profile')
        heightChange = true
      }
    })

    axios({
      method: 'get',
      url: `http://localhost:8080/reviewbook/user/${userID}`,

    }).then((res) => {
      setUser(res.data)
    })

    axios({
      method: 'get',
      url: `http://localhost:8080/reviewbook/review/post/own/${userID}`,

    }).then((res) => {
      dispatch(setUserPost(res.data))
      setPostList(res.data)
      setLoading(false)
    })
  }, [])


  const loadPosts = () => {
    const list = (posts ? posts : postList)
    try {
      return list.map((v, k) => {
        let value = Object.values(v)[0]
        let id = Object.keys(v)[0] //id bai viet
        let postUser = {
          id: value.uid,
          avatar: value.urlUser,
          username: value.name
        }
        return <Post key={k}
          params={props.match.params} // kiem tra post dang o trang profile hay newsFeed de load lai danh sach post  theo redux
          img={value.urlImage}
          user={postUser} // nguoi dang
          likes={value.likes ? value.likes : {}}
          commentCount={value.comments ? Object.keys(value.comments).length : 0}
          content={value.desc}
          postTime={value.time}
          id={id}
          idCurrentUser={currentUser ? currentUser.id : null}
          title={value.title}
          kind={value.kind}
        />
      })
    }
    catch (err) {
      return <Empty />
    }
  }

  const refetchUser = (data) => {
    setUser({ ...data, secondName: data.lastName })
  }

  const loggoutHandler = () => {
    localStorage.clear()
    props.history.push('/')
  }

  const handleChange = async info => {
    if (info.file.status === 'uploading') {
      setLoadingAva(true)
      return
    }
    if (info.file.status === 'done') {
      let img = await uploadStorage(info.file.originFileObj)
      //setUrl(img.url)
      //setNameImage(img.nameImage)
      // Get this url from response in real world.
      axios({
        method: 'put',
        url: `http://localhost:8080/reviewbook/user/${currentUser.id}?token=${localStorage.getItem('token')}`,
        data: {
          image: img.url
        }
      }).then(() => {
        setUser({ ...user, image: img.url })
        if (localStorage.getItem('user')) {
          let newUser = JSON.parse(localStorage.getItem('user'))
          localStorage.setItem('user', JSON.stringify({ ...newUser, image: img.url }))
        }

        setLoadingAva(false)
      })
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


  return (
    <>
      <div className='content_profile'>
        <div className='wrapper_profile'>
          <div className='center-content_profile'>
            <div className='image-top_profile'>
              <div className='avatar_profile'>
                <Upload
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  className='ant-avatar'
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                >
                  <Spin spinning={loadingAva}>
                    <Tooltip placement="top" title="Thay đổi ảnh đại diện">
                      <Avatar size={170} src={user.image} />
                    </Tooltip>
                  </Spin>
                </Upload>

              </div>
              <div className='footer_profile'>
                <div className='name_profile'>
                  <h1 style={{ zIndex: 2 }}>{`${user.firstName || ''} ${user.secondName || ''}`}</h1>
                </div>
                <div className='tabs_profile'>
                  <Tabs defaultActiveKey="1" onChange={(key) => setProfileKey(key)}>
                    <TabPane tab="Dòng thời gian" key="1">
                    </TabPane>
                    <TabPane tab="Giới thiệu" key="2">
                    </TabPane>
                  </Tabs>
                  {
                    (currentUser && currentUser.id) === props.match.params.userID && (
                      <Button type="danger" className='logout_profile' onClick={() => loggoutHandler()}>Logout</Button>
                    )
                  }
                </div>
              </div>
            </div>
            <div className='body_timeline_profile'>
              {
                profileKey === '1' ? (
                  <>
                    <div className='leftBar_profile'>
                      <div className='infor_profile'>
                        <h2>Giới thiệu</h2>
                        {
                          user.gender ? (user.gender === 'male' ?
                            <p><Tag color="geekblue">♂ Nam</Tag></p> : <p><Tag color="magenta">♀ Nữ</Tag></p>)
                            : ''
                        }
                        <div style={{ display: 'flex' }}>
                          <Icon size={18} icon={books} style={{ marginTop: '4px' }} />
                          <p style={{ margin: '6px 0 0 4px' }}>Đã review <b>328</b> cuốn sách</p>
                        </div>
                      </div>
                    </div>
                    <div className='posts_profile'>
                      <CreatePost user={currentUser ? currentUser : { image: '', firstName: 'anonymous' }} params={props.match.params} />
                      <Skeleton loading={loading} active >
                        {loadPosts()}
                      </Skeleton>
                    </div>
                  </>
                )
                  :
                  <DetailProfile user={user} setUser={(data) => refetchUser(data)} />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(Index)