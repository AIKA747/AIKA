import LinkButton from '@/components/LinkButton';
import {
  deleteContentManageGiftId,
  getContentManageGift,
} from '@/services/api/contentService';
import { ProTable } from '@ant-design/pro-components';
import { Divider, message, Modal, Typography } from 'antd';
import CraeteOrEdit from './CreateOrEditStoryGift';
const { Link } = Typography;

export default (props: any) => {
  const { storyId, actionRef } = props;

  const columns = [
    {
      title: 'Gift name',
      dataIndex: 'giftName',
      width: 100,
      render: (_: any, record: any) =>
        record?.giftName ? (
          <Link href="https://ant.design" target="_blank">
            {record?.giftName}
          </Link>
        ) : (
          '-'
        ),
    },
    {
      title: 'Friend degree',
      dataIndex: 'friendDegree',
      valueType: 'text',
      width: 60,
      hideInSearch: true,
    },
    {
      title: 'Story degree',
      dataIndex: 'storyDegree',
      width: 80,
      hideInSearch: true,
    },

    {
      title: 'Created time',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 100,
      hideInSearch: true,
    },
    {
      title: 'action',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: (_: any, record: any) => (
        <>
          <CraeteOrEdit
            title={' '}
            trigger={<LinkButton>Edit</LinkButton>}
            giftId={record.id}
            storyId={storyId}
            callback={() => {
              actionRef.current.reload();
            }}
          />

          <Divider type="vertical" />

          <LinkButton
            style={{ color: 'red' }}
            onClick={() => {
              Modal.confirm({
                title: 'confirmed to delete?',
                onOk() {
                  const { id } = record;
                  const hide = message.info('saving....');
                  deleteContentManageGiftId({
                    id,
                  })
                    .then((res) => {
                      if (res.code === 0) {
                        hide();
                        message.success('Success');
                        actionRef.current?.reload();
                      } else {
                        message.error(res.msg);
                      }
                    })
                    .catch((err) => message.error(err));
                },
              });
            }}
          >
            {'Delete'}
          </LinkButton>
        </>
      ),
    },
  ];

  return (
    <ProTable<API.UserInfo>
      headerTitle="Story gift list"
      actionRef={actionRef}
      rowKey="id"
      tile={false}
      search={false}
      request={async (params, sorter, filter) => {
        console.log(params, sorter, filter);
        const { data } = await getContentManageGift({
          ...params,
          // FIXME: remove @ts-ignore
          // @ts-ignore
          sorter,
          filter,
          pageNo: params.current || 1,
          pageSize: params.pageSize || 10,
          storyId,
        });
        return {
          data: data.list || [],
          total: data.total,
          success: true,
        };
      }}
      columns={columns as any}
    />
  );
};
