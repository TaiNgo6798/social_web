import React, { useState, useEffect } from 'react'

import {
  CarryOutOutlined,
  HomeOutlined,
  InboxOutlined,
  LogoutOutlined,
  TeamOutlined,
} from '@ant-design/icons'

import { Layout, Menu, Breadcrumb } from 'antd'
import './index.scss'

import Logo from '../../../assets/images/logo.png'
//components
import Approve from './approve'
import PostManager from './posts'
import AccountManager from './account'
import Dashboard from './dashboard'

const { Content, Sider } = Layout

function Index(props) {
  const [activeMenu, setActiveMenu] = useState('1')
  const menuText = ['Dashboard', 'Duyệt bài', 'Quản lý bài viết', 'Quản lý tài khoản']
  const { setIsLogged } = props

  const loggOut = () => {
    localStorage.clear()
    setIsLogged()
  }

  return <>
    <Layout>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <img src={Logo} className='logo_admin' />
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            onSelect={(e) => setActiveMenu(e.key)}
            style={{ borderRight: 0, display: 'flex', flexDirection: 'column', paddingTop: '4em' }}
          >
            <Menu.Item key="1"><HomeOutlined />Dashboard</Menu.Item>
            <Menu.Item key="2"><CarryOutOutlined />Duyệt bài</Menu.Item>
            <Menu.Item key="3"><InboxOutlined />Quản lý bài viết</Menu.Item>
            <Menu.Item key="4"><TeamOutlined />Quản lý tài khoản</Menu.Item>
            <Menu.Item key="5" style={{ position: 'absolute', bottom: 0 }}
              onClick={() => loggOut()}
            ><LogoutOutlined />Đăng xuất</Menu.Item>

          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <h1 style={{ fontSize: 'large', marginTop: '2em' }}>{menuText[activeMenu - 1]}</h1>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
              overflow: 'auto'
            }}
          >
            {
              activeMenu === '1' &&
              <>
                <Dashboard />
              </>
            }
            {
              activeMenu === '2' &&
              <>
                <Approve />
              </>
            }
            {
              activeMenu === '3' &&
              <>
                <PostManager />
              </>
            }
            {
              activeMenu === '4' &&
              <>
                <AccountManager />
              </>
            }

          </Content>
        </Layout>
      </Layout>
    </Layout>
  </>
}

export default Index