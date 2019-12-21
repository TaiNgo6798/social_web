import React, { useState, useEffect } from 'react'
import { Table, Divider, Tag, notification, Skeleton, Button, Popconfirm } from 'antd'
import axios from 'axios'
import Swal from 'sweetalert2'
import './index.scss'

function Index() {
  const [data, setData] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoadingData(true)
    axios({
      method: 'get',
      url: `http://localhost:8080/reviewbook/users?token=${localStorage.getItem('tokenAdmin')}`,
    }).then((res) => {
      let arr = []
      try {
        Object.values(res.data).map((v, i) => {
          arr.push({
            key: Object.keys(res.data)[i],
            id: Object.keys(res.data)[i],
            stt: i + 1,
            birthday: v.birthday,
            email: v.email,
            firstName: v.firstName,
            secondName: v.secondName,
            gender: v.gender,
            image: v.image,
            phone: v.phone,
            role: [v.role ? v.role : 'Thường', typeof (v.lock) !== 'undefined' ? (v.lock === true ? 'Đã bị khoá' : 'false') : ''], //false la khong khoa
          })
        })
      } catch (err) {
        arr = []
      }
      setData([...arr])
      setLoadingData(false)
    })
  }

  const sendMail = (email) => {
    axios({
      method: 'post',
      url: 'http://localhost:8080/reviewbook/forgot',
      data: {
        email
      }
    }).then(res => {
      if (res.data.success) {
        notification.success({
          message: 'Gửi mail thành công',
          placement: 'bottomRight',
        })

      } else {
        notification.error({
          message: 'Gửi mail không thành công :(',
          placement: 'bottomRight',
        })
      }
    })
  }


  const demoImage = (image) => {
    Swal.fire({
      imageUrl: image,
    })
  }

  const lockAccountHandler = (id, lock) => {
    axios({
      method: 'post',
      url: `http://localhost:8080/reviewbook/user/lock/${id}?token=${localStorage.getItem('tokenAdmin')}`,
      data: {
        lock
      }
    }).then(res => {
      notification.success({
        message: 'Xong !',
        placement: 'bottomRight',
      })
      loadData()
    })

  }

  const columns = [
    {
      title: '#',
      dataIndex: 'stt',
      key: 'stt',
      render: text => <p>{text}</p>,
    },
    {
      title: 'Avatar',
      dataIndex: 'image',
      key: 'image',
      render: (src) => {
        return <img onClick={() => demoImage(src)} className='img_row' src={src.length > 0 ? src : 'https://shadow888.com/images/default/noimagefound.png'} />
      },
    },
    {
      title: 'Tên',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text) => <p style={{ wordWrap: "break-word", wordBreak: 'break-word', maxHeight: '10em' }}>{text}</p>
    },
    {
      title: 'Họ',
      dataIndex: 'secondName',
      key: 'secondName',
      render: text => <p>{text}</p>,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      render: text => <p>{text}</p>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: text => <p>{text}</p>,
    },
    {
      title: 'Thẻ',
      key: 'role',
      dataIndex: 'role',
      render: tags => (
        <span>
          {tags.map((tag, i) => {
            let color
            switch (tag) {
              case 'Thường':
                color = ''
                break;
              case 'Đã bị khoá':
                color = 'red'
                break;
              case 'admin':
                color = 'gold'
                break;

              default:
                break;
            }
            {
              return tag !== 'false' && tag !== '' && (
                <Tag color={color} key={i}>
                  {tag}
                </Tag>
              )
            }

          })}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'id',
      render: (id, col) => (
        <span>
          {
            col.role[1] === 'Đã bị khoá' ? (
              <a style={{ color: 'green' }} onClick={() => lockAccountHandler(id, false)}>MỞ KHOÁ</a>
            ) : (
                <Popconfirm
                  title="Bạn có chắc chắn muốn KHOÁ tài khoản này?"
                  onConfirm={() => lockAccountHandler(id, true)}
                  okText="Yes"
                  cancelText="No"
                >
                  <a style={{ color: 'red' }}>KHOÁ</a>
                </Popconfirm>
              )
          }
          <Divider type='vertical' />
          <a onClick={() => sendMail(col.email)}>Gửi email cấp lại mật khẩu</a>
        </span>
      ),
    },
  ];

  return (
    <>
      <Button style={{ display: 'block', float: 'right', margin: '1em', zIndex: 100 }} onClick={() => loadData()} type='primary'>Refresh</Button>
      <Table pagination={{ pageSize: 6 }} columns={columns} dataSource={data} loading={loadingData} />
    </>
  )
}

export default Index