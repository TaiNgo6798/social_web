import React, { useMemo } from 'react'
import { Comment, Tooltip, Spin, Avatar } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import './index.scss'
import { withRouter } from 'react-router-dom'

const GET_COMMENTS = gql`
  query getCmt($postID: String!) {
    getCommentsByPostID(postID: $postID) {
      _id
      who {
        _id
        firstName
        lastName
        email
      }
      postID
      text
      time
    }
  }
`
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const Index = props => {
  const { postID } = props
  const { loading, data } = useQuery(GET_COMMENTS, {
    variables: {
      postID,
    },
  })

  const renderComments = useMemo(() => {
    if (!loading) {
      try {
        return data.getCommentsByPostID.map((v, k) => {
          return (
            <Comment
              key={v._id}
              author={`${v.who.firstName} ${v.who.lastName}`}
              avatar={
                <Avatar
                  src={''}
                  alt={v.time}
                  onClick={() => props.history.push(`profile/${v.who._id}`)}
                />
              }
              content={<p>{v.text}</p>}
              // datetime={
              //   <Tooltip title={time2.toLocaleString()}>
              //     <span>{TIME.fromNow()}</span>
              //   </Tooltip>
              // }
            />
          )
        })
      } catch (error) {
        console.log(error)
      }
    } else null
  }, [loading])

  return (
    <>
      <Spin spinning={loading} indicator={loadingIcon} >
        <div>
        {renderComments}
        </div>
      </Spin>
    </>
  )
}

export default withRouter(Index)
