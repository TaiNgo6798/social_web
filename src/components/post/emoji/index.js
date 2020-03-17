import React, { useState } from 'react'
import {Popover, Button} from 'antd'

import './index.scss'
import LikeGif from '@assets/icons/like.gif'
import LoveGif from '@assets/icons/love.gif'
import HahaGif from '@assets/icons/haha.gif'
import WowGif from '@assets/icons/wow.gif'
import SadGif from '@assets/icons/sad.gif'
import AngryGif from '@assets/icons/angry.gif'

const LIKE = <img src={LikeGif} className="icon_gif" />

const HEART = <img src={LoveGif} className="icon_gif" />

const HAHA = <img src={HahaGif} className="icon_gif" />

const WOW = <img src={WowGif} className="icon_gif" />

const SAD = <img src={SadGif} className="icon_gif" />

const ANGRY = <img src={AngryGif} className="icon_gif" />



const Index = props => {
  const { reactHandler, likes, currentUser } = props
  const [emojiVisible, setEmojiVisible] = useState(false)

  const getCurrentReact = () => {
    let react = likes.find(v => v.who._id === currentUser._id).react
    switch (react) {
      case 'LIKE':
        return (
          <>
            {LIKE}
            <p style={{ color: '#2078F4', margin: 0 }} className="reacted">
              Thích
            </p>
          </>
        )
      case 'LOVE':
        return (
          <>
            {HEART}
            <p style={{ color: '#F33E58', margin: 0 }} className="reacted">
              Yêu thích
            </p>
          </>
        )
      case 'WOW':
        return (
          <>
            {WOW}
            <p style={{ color: '#F7B126', margin: 0 }} className="reacted">
              Wow
            </p>
          </>
        )
      case 'HAHA':
        return (
          <>
            {HAHA}
            <p style={{ color: '#F7B126', margin: 0 }} className="reacted">
              Haha
            </p>
          </>
        )
      case 'SAD':
        return (
          <>
            {SAD}
            <p style={{ color: '#F7B126', margin: 0 }} className="reacted">
              Buồn
            </p>
          </>
        )
      case 'ANGRY':
        return (
          <>
            {ANGRY}
            <p style={{ color: '#E9710E', margin: 0 }} className="reacted">
              Tức á !
            </p>
          </>
        )
      default:
        return null
    }
  }

  const iconClick = (react) => {
    reactHandler(react)
    setEmojiVisible(false)
  }

  return (
    <Popover
      content={
        <div className="emoji_list">
          <div onClick={() => iconClick('LIKE')}>{LIKE}</div>
          <div onClick={() => iconClick('LOVE')}>{HEART}</div>
          <div onClick={() => iconClick('HAHA')}>{HAHA}</div>
          <div onClick={() => iconClick('WOW')}>{WOW}</div>
          <div onClick={() => iconClick('SAD')}>{SAD}</div>
          <div onClick={() => iconClick('ANGRY')}>{ANGRY}</div>
        </div>
      }
      placement="left"
      visible={emojiVisible}
      onVisibleChange={e => setEmojiVisible(e)}
    >
      <Button>
        {likes.map(v => v.who._id).indexOf(currentUser._id) !== -1
          ? getCurrentReact()
          : 'Thích'}
      </Button>
    </Popover>
  )
}

export { LIKE, HEART, HAHA, WOW, SAD, ANGRY }

export default Index
