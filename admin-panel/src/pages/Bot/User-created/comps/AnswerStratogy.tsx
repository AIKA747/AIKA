import { ProCard, ProDescriptions } from '@ant-design/pro-components';

import {} from '@/services/api/jiqirenguanli';
import { Divider } from 'antd';

export default (props: any) => {
  const { data } = props;

  return (
    <ProCard>
      <h3>Answer Stratogy</h3>
      <Divider />
      <ProDescriptions
        // title="高级定义列表request columns"
        column={1}
        dataSource={data}
        // emptyText={'空'}
        columns={[
          {
            title: 'Rules',
            key: 'text',
            dataIndex: 'rules',
          },
        ]}
      ></ProDescriptions>
    </ProCard>
  );
};
