import React, { useState, useEffect } from 'react'
import { Table, Divider, Tag, notification, Skeleton, Button, Popconfirm } from 'antd'


import Swal from 'sweetalert2'
import './index.scss'

function Index() {
  const [data, setData] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    let mounted = true
    if (mounted) {
      loadData()
    }
    return () => { mounted = false }
  }, [])

  const loadData = () => {
    setLoadingData(true)

  }

  const handleDelete = (id) => {

  }

  const demoImage = (image) => {
    Swal.fire({
      imageUrl: image,
    })
  }

  const handleApprove = (id) => {

  }

  const columns = [
    {
      title: '#',
      dataIndex: 'stt',
      key: 'stt',
      render: text => <p>{text}</p>,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (src) => {
        return <img onClick={() => demoImage(src)} className='img_row' src={src.length > 0 ? src : 'https://shadow888.com/images/default/noimagefound.png'} />
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'desc',
      key: 'desc',
      render: (desc) => <p style={{ wordWrap: 'break-word', wordBreak: 'break-word', maxHeight: '10em' }}>{desc.substring(0, 40)}</p>
    },
    {
      title: 'Người đăng',
      dataIndex: 'who',
      key: 'who',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Thể loại',
      dataIndex: 'kind',
      key: 'kind',
      render: text => (
        <Tag color={'magenta'} >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Thẻ',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <span>
          {tags.map((tag, i) => {
            let color = 'orange'
            return (
              <Tag color={color} key={i}>
                {tag}
              </Tag>
            )
          })}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'id',
      render: (id) => (
        <span>
          <a onClick={() => handleApprove(id)}>Duyệt bài này</a>
          <Divider type="vertical" />
          <Popconfirm
            title="Bạn có chắc muốn xoá chứ?"
            onConfirm={() => handleDelete(id)}
            okText="Yes"
            cancelText="No"
          >
            <a style={{ color: 'red' }}>Bỏ qua</a>
          </Popconfirm>

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