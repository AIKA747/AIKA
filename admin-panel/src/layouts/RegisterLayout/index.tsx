import { Outlet } from '@umijs/max';
import { Layout } from 'antd';
import './index.less';

const { Content } = Layout;
export default function UserLayout() {
  return (
    <Layout className="regiter-layout-wrap">
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}
