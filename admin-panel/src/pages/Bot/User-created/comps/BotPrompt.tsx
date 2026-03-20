import { ProCard, ProDescriptions } from '@ant-design/pro-components';

import {} from '@/services/api/jiqirenguanli';
import { Divider } from 'antd';

export default (props: any) => {
  const { data } = props;

  return (
    <ProCard>
      <h3>Bot Prompt</h3>
      <Divider />
      <ProDescriptions
        column={1}
        dataSource={data}
        // emptyText={'空'}
        columns={[
          {
            title: 'Bot age',
            key: 'text',
            dataIndex: 'age',
          },
          {
            title: 'Category',
            key: 'text',
            dataIndex: 'categoryName',
          },
          {
            title: 'Role profession',
            key: 'text',
            dataIndex: 'profession',
          },
          {
            title: 'Personal strength',
            key: 'text',
            dataIndex: 'personalStrength',
          },
        ]}
      ></ProDescriptions>
    </ProCard>
  );
};
