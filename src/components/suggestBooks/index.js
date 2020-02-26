import React, { useState, useEffect } from 'react'
import { List, Avatar, Button, Skeleton } from 'antd'
import reqwest from 'reqwest'


// import css
import './index.scss'

const Index = () => {


  // useEffect(() => {
  //   let mounted = true
  //   if (mounted) {
  //     getData(res => {
  //       setInitLoading(false)
  //       setData(res.results)
  //       setList(res.results)
  //     })
  //   }
  //   return () => { mounted = false }
  // }, [])

  // const getData = callback => {
  //   reqwest({
  //     url: fakeDataUrl,
  //     type: 'json',
  //     method: 'get',
  //     contentType: 'application/json',
  //     success: res => {
  //       callback(res)
  //     },
  //   })
  // }

  // const onLoadMore = () => {
  //   setLoading(true)
  //   setList(data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))))

  //   getData(res => {
  //     const dataNew = data.concat(res.results)
  //     setData(dataNew)
  //     setList(dataNew)
  //     setLoading(false)
  //   })
  // }

  // const loadMore =
  //   !initLoading && !loading ? (
  //     <div
  //       style={{
  //         textAlign: 'center',
  //         marginTop: 12,
  //         height: 32,
  //         lineHeight: '32px',
  //         marginBottom: '12px'
  //       }}
  //     >
  //       <Button onClick={onLoadMore}>loading more</Button>
  //     </div>
  //   ) : null

  return (
    <>
      <List
        className="demo-loadmore-list"
        loading={true}
        itemLayout="horizontal"
        renderItem={item => (
          <List.Item>
            <Skeleton avatar title={true} loading={true} active>

            </Skeleton>
          </List.Item>
        )}
      />
    </>
  )
}

export default Index