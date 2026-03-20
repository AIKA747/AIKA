import {} from '@/services/api/jiqirenguanli';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Avatar, Divider } from 'antd';

export default (props: any) => {
  const { data } = props;
  console.log({ data });

  return (
    <ProCard>
      <h3>Basic Infomation</h3>
      <Divider />
      <ProDescriptions
        // title="高级定义列表request columns"
        column={1}
        dataSource={data}
        // emptyText={'空'}
        columns={[
          {
            title: 'Avatar',
            key: 'text',
            dataIndex: 'avatar',
            render(avatar) {
              return <Avatar size={64} src={avatar} />;
            },
          },
          {
            title: 'Name',
            key: 'state',
            dataIndex: 'botName',
          },
          {
            title: 'Bot id',
            key: 'date',
            dataIndex: 'id',
          },
          {
            title: 'Grnder',
            key: 'date',
            dataIndex: 'gender',
          },
          {
            title: 'Introduce',
            dataIndex: 'botIntroduce',
          },
          {
            title: 'Greet words',
            key: 'switch',
            dataIndex: 'prompts',
            // valueType: 'switch',
          },
        ]}
      ></ProDescriptions>
    </ProCard>
  );
};
