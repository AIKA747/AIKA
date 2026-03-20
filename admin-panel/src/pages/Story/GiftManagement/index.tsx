import { PageContainer } from '@ant-design/pro-components';
import { Breadcrumb } from 'antd';
import ListTable from './listTable';

export default (props: any) => {
  const { inStory } = props;

  return (
    <PageContainer
      breadcrumb={
        inStory
          ? false
          : ((
              <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Story Management</Breadcrumb.Item>
                <Breadcrumb.Item>
                  <a href="">Gift Management</a>
                </Breadcrumb.Item>
              </Breadcrumb>
            ) as any)
      }
      // title={false}
    >
      <ListTable inStory={inStory} />
    </PageContainer>
  );
};
