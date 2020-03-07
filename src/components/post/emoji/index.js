import React from 'react'
import './index.scss'

const Index = () => {
  return (
    <div className='emoji_list' >
      <div className="emoji like">
        <i className="fa fa-thumbs-up fa-5x" />
      </div>
      <div className="emoji heart">
        <i className="fa fa-heart fa-5x" />
      </div>
      <div className="emoji haha">
        <div className="face face-haha" >
          <div className="eyes-haha" />
          <div className="mouth-haha">
            <div className="tongue-haha" />
          </div>
        </div>
      </div>
      <div className="emoji wow">
        <div className="face face-wow">
          <div className="eyebrows-wow" />
          <div className="eyes-wow" />
          <div className="mouth-wow" />
        </div>
      </div>
      <div className="emoji sad">
        <div className="face face-sad">
          <div className="eyebrows-sad" />
          <div className="eyes-sad" />
          <div className="mouth-sad" />
        </div>
      </div>
      <div className="emoji angry">
        <div className="face face-angry">
          <div className="eyebrows-angry" />
          <div className="eyes-angry" />
          <div className="mouth-angry" />
        </div>
      </div>
    </div>

  )
}

export default Index