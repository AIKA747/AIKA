import LinkButton from '@/components/LinkButton';
import {
  deleteContentManageGiftId,
  getContentManageGift,
} from '@/services/api/contentService';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Divider, message, Modal } from 'antd';
import { useRef } from 'react';

export default (props: any) => {
  const { inStory } = props;
  const actionRef = useRef<ActionType>();

  const columns = [
    {
      title: 'Gift name',
      dataIndex: 'giftName',
      width: 100,
      render: (_: any, record: any) =>
        record?.giftName ? <span>{record?.giftName}</span> : '-',
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
          <LinkButton
            onClick={() => {
              history.push(`/story/gift/list/edit/${record.id.toString()}`);
            }}
          >
            Edit
          </LinkButton>

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
      search={
        inStory
          ? false
          : {
              labelWidth: 120,
            }
      }
      toolBarRender={
        inStory
          ? false
          : () => [
              <Button
                key="1"
                type="primary"
                onClick={() => {
                  history.push(`/story/gift/list/edit/new`);
                }}
              >
                Add New
              </Button>,
            ]
      }
      request={async (params, sorter, filter) => {
        const { data } = await getContentManageGift({
          ...params,
          // FIXME: remove @ts-ignore
          // @ts-ignore
          sorter,
          filter,
          pageNo: params.current || 1,
          pageSize: params.pageSize || 10,
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
