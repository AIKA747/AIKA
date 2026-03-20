import { Outlet } from '@umijs/max';
import { Layout } from 'antd';
import './index.less';

const { Content, Footer } = Layout;
export default function UserLayout() {
  return (
    <Layout className="user-layout-wrap">
      {/* <Header className="header-wrap">
        <div className="logo-wrap">
          <img
            src={require('@/assets/images/logo.svg').default}
            alt=""
            width={30}
            height={30}
            className="logo"
          />
          <span className="text">Aika Admin</span>
        </div>
      </Header> */}
      <Content>
        <div className="user-layout-bg"></div>
        <Outlet />
      </Content>
      <Footer>
        <div>Copyright ©2024 Aika</div>
        {/* <h5 style={{ color: 'red' }}>2024-01-31-a</h5> */}
      </Footer>
    </Layout>
  );
}
