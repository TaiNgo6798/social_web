import React from 'react'
import './index.scss'

const LIKE = (
  <div className="emoji like" >
    <i className="fa fa-thumbs-up fa-5x" />
  </div>
)

const HEART = (
  <div className="emoji heart" >
    <i className="fa fa-heart fa-5x" />
  </div>
)

const HAHA = (
  <div className="emoji haha" >
    <div className="face face-haha">
      <div className="eyes-haha" />
      <div className="mouth-haha">
        <div className="tongue-haha" />
      </div>
    </div>
  </div>
)

const WOW = (
  <div className="emoji wow" >
    <div className="face face-wow">
      <div className="eyebrows-wow" />
      <div className="eyes-wow" />
      <div className="mouth-wow" />
    </div>
  </div>
)

const SAD = (
  <div className="emoji sad" >
    <div className="face face-sad">
      <div className="eyebrows-sad" />
      <div className="eyes-sad" />
      <div className="mouth-sad" />
    </div>
  </div>
)

const ANGRY = (
  <div className="emoji angry" >
    <div className="face face-angry">
      <div className="eyebrows-angry" />
      <div className="eyes-angry" />
      <div className="mouth-angry" />
    </div>
  </div>
)

const Index = props => {
  const { reactHandler } = props

  return (
    <div className="emoji_list">
      <div onClick={() => reactHandler('LIKE')}>{LIKE}</div>
      <div onClick={() => reactHandler('LOVE')}>{HEART}</div>
      <div onClick={() => reactHandler('HAHA')}>{HAHA}</div>
      <div onClick={() => reactHandler('WOW')}>{WOW}</div>
      <div onClick={() => reactHandler('SAD')}>{SAD}</div>
      <div onClick={() => reactHandler('ANGRY')}>{ANGRY}</div>
    </div>
  )
}

export { LIKE, HEART, HAHA, WOW, SAD, ANGRY }

export default Index
