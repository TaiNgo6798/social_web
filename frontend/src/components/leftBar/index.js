import React from 'react'
import { Menu, Icon, Switch } from 'antd';

// import css
import './index.scss'


const Index = () => {
  const { SubMenu } = Menu


  return <>
    <div className='bar'>
      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode={'vertical'}
        theme={'light'}
      >
        <SubMenu
          
          title={
            <span>
              <Icon type="book" />
              <span>Sách tiếng việt</span>
            </span>
          }
        >

          <Menu.Item >Sách Mới</Menu.Item>
          <Menu.Item >Sách Bán Chạy</Menu.Item>
          <Menu.Item >Sách Thiếu Nhi</Menu.Item>
          <Menu.Item >Sách Văn Học</Menu.Item>
          <Menu.Item >Sách Kinh Tế</Menu.Item>
          <Menu.Item >Sách Kỹ Năng</Menu.Item>
          {/* <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu> */}
        </SubMenu>

        <SubMenu
          
          title={
            <span>
              <Icon type="book" />
              <span>Sách nước ngoài</span>
            </span>
          }
        >
          <Menu.Item >Best Seller</Menu.Item>
          <Menu.Item >New Arrival</Menu.Item>
          <Menu.Item >Children's Books</Menu.Item>
          <Menu.Item >Fiction - Literature</Menu.Item>
          <Menu.Item >Business & Economics</Menu.Item>
          <Menu.Item >Self Help</Menu.Item>
          <Menu.Item >Education - Teaching</Menu.Item>
        </SubMenu>

        <SubMenu

          title={
            <span>
              <Icon type="book" />
              <span>Sách bạn nên đọc</span>
            </span>
          }
        >
          <Menu.Item >Người nổi tiếng đọc gì</Menu.Item>
          <Menu.Item >Hành trình làm mẹ</Menu.Item>
          <Menu.Item >Sách bán chạy trong năm</Menu.Item>
          <Menu.Item >Câu lạc bộ Harry Potter</Menu.Item>
          <Menu.Item >Must-read</Menu.Item>
          <Menu.Item >Books into Movies</Menu.Item>

        </SubMenu>

        <SubMenu

          title={
            <span>
              <Icon type="appstore" />
              <span>Công ty phát hành</span>
            </span>
          }
        >
           <Menu.Item >NXB Trẻ</Menu.Item>
          <Menu.Item >NXB Kim Đồng</Menu.Item>
          <Menu.Item >Nhã Nam</Menu.Item>
          <Menu.Item >Alphabooks</Menu.Item>
          <Menu.Item >AZ Việt Nam</Menu.Item>
          <Menu.Item >First News</Menu.Item>
           <Menu.Item >Đinh Tị</Menu.Item>
          <Menu.Item >MC Books</Menu.Item>
          <Menu.Item >Đông A</Menu.Item>
          <Menu.Item >Bách Việt</Menu.Item>
          <Menu.Item >Phương Nam</Menu.Item>
          <Menu.Item >IPM</Menu.Item>
          <Menu.Item >Minh Long</Menu.Item>


        </SubMenu>
      </Menu>
    </div>
  </>
}

export default Index