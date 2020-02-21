import React, { useState, useEffect } from 'react'
import { Table, Divider, Tag, notification, Skeleton, Button, Popconfirm } from 'antd'


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

  }

  const sendMail = (email) => {

  }


  const demoImage = (image) => {
    Swal.fire({
      imageUrl: image,
    })
  }

  const lockAccountHandler = (id, lock) => {


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
      render: (text) => <p style={{ wordWrap: 'break-word', wordBreak: 'break-word', maxHeight: '10em' }}>{text}</p>
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
                break
              case 'Đã bị khoá':
                color = 'red'
                break
              case 'admin':
                color = 'gold'
                break

              default:
                break
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
  ]

  return (
    <>
      <Button style={{ display: 'block', float: 'right', margin: '1em', zIndex: 100 }} onClick={() => loadData()} type='primary'>Refresh</Button>
      <Table pagination={{ pageSize: 6 }} columns={columns} dataSource={data} loading={loadingData} />
    </>
  )
}

export default Index