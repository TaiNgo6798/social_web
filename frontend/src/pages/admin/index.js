import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import axios from 'axios'
import './index.scss'
import Login from './login'
import Main from './main'
function Index() {
  const [isLogged, setIsLogged] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    let tokenAdmin = localStorage.getItem('tokenAdmin') ?  localStorage.getItem('tokenAdmin') : 'shit'
    axios({
      method: 'POST',
      url: `http://localhost:8080/reviewbook/current?token=${tokenAdmin}`
    }).then((res) => {
      if(res.data.success === false)
      {
        setIsLogged(false)
      }
      else
      setIsLogged(true)
      setLoading(false)
    })
  }, [])



  return (
    <>
    <Spin spinning={loading} style={{maxHeight: '100vh'}}>
      
      <div className='content_admin'>
        <div className='wrapper_admin'>
        {
            !isLogged ? (
              <Login checkAccount={() => setIsLogged(true)} />
            ) : <Main setIsLogged={() => setIsLogged(false)}/>
          }
        </div>
      </div>
        </Spin>
    </>
  )
}

export default Index