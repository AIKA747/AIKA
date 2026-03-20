import { ProCard, ProDescriptions } from '@ant-design/pro-components';

import {} from '@/services/api/jiqirenguanli';
import { Divider } from 'antd';

export default (props: any) => {
  const { data } = props;

  return (
    <ProCard>
      <h3>Add-on</h3>
      <Divider />
      <ProDescriptions
        // title="高级定义列表request columns"
        column={1}
        dataSource={data}
        // emptyText={'空'}
        columns={[
          {
            title: 'Prompts',
            key: 'text',
            dataIndex: 'prompts',
          },
        ]}
      ></ProDescriptions>
    </ProCard>
  );
};
