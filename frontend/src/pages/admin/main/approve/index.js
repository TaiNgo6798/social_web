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
      url: `http://localhost:8080/reviewbook/approvereviews?token=${localStorage.getItem('tokenAdmin')}`,
    }).then((res) => {
      let arr = []
      try {
        Object.values(res.data).map((v, i) => {
          let value = Object.values(v)[0]
          arr.push({
            key: Object.keys(v)[0],
            id: Object.keys(v)[0],
            stt: i + 1,
            image: value.urlImage,
            desc: value.desc,
            who: value.name,
            time: value.time,
            kind: value.kind ? (value.kind.length > 0 && value.kind) : 'Chưa xác định',
            tags: ['Bài đăng đang đợi duyệt']
          })
        })
      } catch (err) {
        arr = []
      }
      setData([...arr])
      setLoadingData(false)
    })
  }

  const handleDelete = (id) => {
    axios({
      method: 'delete',
      url: `http://localhost:8080/reviewbook/approvereviews/${id}?token=${localStorage.getItem('tokenAdmin')}`,
    }).then((res) => {
      notification.success({
        message: `Đã xoá bài viết !`,
        placement: 'bottomRight',
      })
      loadData()
    }).catch((err) => {
      notification.error({
        message: err.toString(),
        placement: 'bottomRight',
      })
    })
  }

  const demoImage = (image) => {
    Swal.fire({
      imageUrl: image,
    })
  }

  const handleApprove = (id) => {
    axios({
      method: 'post',
      url: `http://localhost:8080/reviewbook/approvereviews/${id}?token=${localStorage.getItem('tokenAdmin')}`,
    }).then((res) => {
      notification.success({
        message: `Đã duyệt bài !`,
        placement: 'bottomRight',
      })
      loadData()
    }).catch((err) => {
      notification.error({
        message: err,
        placement: 'bottomRight',
      })
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
      render: (desc) => <p style={{ wordWrap: "break-word", wordBreak: 'break-word', maxHeight: '10em' }}>{desc.substring(0, 40)}</p>
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
            let color = 'orange';
            return (
              <Tag color={color} key={i}>
                {tag}
              </Tag>
            );
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
  ];

  return (
    <>
      <Button style={{ display: 'block', float: 'right', margin: '1em', zIndex: 100 }} onClick={() => loadData()} type='primary'>Refresh</Button>
        <Table pagination={{ pageSize: 6 }} columns={columns} dataSource={data} loading={loadingData}/>
    </>
  )
}

export default Index