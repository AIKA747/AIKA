import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import {
  deleteContentManagePost,
  getContentManagePostCreateConfig,
  getContentManagePostList,
  putContentManagePostBlocked,
  putContentManagePostCreateConfig,
} from '@/services/api/tieziguanli';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProCard,
  ProColumns,
  ProFormDigit,
  ProFormSwitch,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Form, Image, message, Modal, Space, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

// 帖子对象
interface Post {
  id: string;
  cover: string;
  title: string;
  summary: string;
  author: string;
  authorName: string;
  authorAvatar: string;
  type: string;
  keywords?: string;
  recommendTags?: string;
  createdAt: string;
  blocked: boolean;
  flagged?: boolean;
  categories?: string[];
}

// 发帖全局配置对象
interface PostConfig {
  /** 是否开启禁止发贴功能 */
  postCreateBlockedEnabled?: boolean;
  /** 设置帖子被标记多次则禁止用户发贴 */
  postCreateBlockedNumber?: number;
}

export default () => {
  const actionRef = useRef<ActionType>();

  const [form] = Form.useForm<PostConfig>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 获取发帖全局配置
  const { data: postConfig } = useRequest(
    () => getContentManagePostCreateConfig(),
    {
      manual: false,
    },
  );

  // 批量屏蔽、公开
  const batchBlocked = (ids: string, blocked: boolean) => {
    const hide = message.loading('loading...', 0);
    putContentManagePostBlocked({
      ids: ids,
      blocked: !blocked,
    })
      .then((res) => {
        hide();
        if (res.code === 0) {
          message.success('Operation successful，About to refresh', 1.5, () => {
            actionRef.current?.reload();
          });
        } else {
          message.error(res.msg);
        }
      })
      .catch(() => {
        message.error('error');
      });
  };

  // 批量删除
  const batchDelete = (ids: string) => {
    const hide = message.loading('loading...', 0);
    deleteContentManagePost({
      ids: ids,
    }).then(() => {
      hide();
      message.success('Operation successful，About to refresh', 1.5, () => {
        actionRef.current?.reload();
      });
    });
  };

  const columns: ProColumns<Post>[] = [
    {
      title: 'Search word',
      dataIndex: 'searchWord',
      editable: false,
      hideInTable: true,
      align: 'center',
      fieldProps: {
        placeholder: 'title、content、auther name or sensitive word',
      },
    },
    {
      title: 'Cover',
      dataIndex: 'cover',
      width: 100,
      hideInSearch: true,
      render: (_, record) =>
        record.cover ? <Image width={100} src={record.cover} /> : '-',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      editable: false,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: 'Summary',
      dataIndex: 'summary',
      editable: false,
      hideInSearch: true,
      align: 'center',
      render: (_v, record) => {
        if (record?.summary?.length > 40) {
          return (
            <Tooltip title={record?.summary}>
              <span>{record?.summary.substring(0, 40) + '...'}</span>
            </Tooltip>
          );
        }
        return record?.summary || '-';
      },
    },
    {
      title: 'Sensitive Label',
      dataIndex: 'categories',
      editable: false,
      hideInSearch: true,
      align: 'center',
      render: (_v, record) => {
        const items = record?.categories || [];
        return (
          <Space size={[0, 8]} wrap>
            {items.slice(0, 3).map((item, index) => (
              <Tag key={index} color="red">
                {item}
              </Tag>
            ))}
            {items.length > 3 && <span>...</span>}
          </Space>
        );
      },
    },
    {
      title: 'Sensitive word triggered',
      dataIndex: 'flagged',
      hideInTable: true,
      valueEnum: {
        yes: 'yes',
        no: 'no',
      },
    },
    {
      title: 'Author Name',
      dataIndex: 'authorName',
      editable: false,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: 'Created Time',
      dataIndex: 'createdAt',
      align: 'center',
      editable: false,
      hideInSearch: true,
      render: (_v, record) =>
        record?.createdAt
          ? dayjs(record?.createdAt).format('YYYY-MM-DD HH:mm:ss')
          : '-',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      editable: false,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'blocked',
      editable: false,
      hideInSearch: true,
      align: 'center',
      render: (_v, record) => {
        return (
          // <Badge
          //   status={record?.blocked ? 'error' : 'success'}
          //   text={record?.blocked ? 'Blocked' : 'Public'}
          // />
          <Tag bordered={false} color={record?.blocked ? 'error' : 'cyan'}>
            {record?.blocked ? 'Blocked' : 'Public'}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      align: 'left',
      dataIndex: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => {
              history.push('/contentManagement/postList/' + record.id);
            }}
          >
            View
          </LinkButton>
          <LinkButton
            onClick={() => {
              if (record.id) {
                Modal.confirm({
                  title: `Are you sure ${
                    record.blocked ? 'Public' : 'Block'
                  } the post？`,
                  onOk: () => {
                    batchBlocked(record.id, record.blocked);
                  },
                });
              }
            }}
          >
            {record.blocked ? 'Public' : 'Block'}
          </LinkButton>
          <LinkButton
            onClick={() => {
              if (record.id) {
                Modal.confirm({
                  title: `Are you sure delete this post?`,
                  okType: 'danger',
                  onOk: () => {
                    batchDelete(record.id);
                  },
                });
              }
            }}
          >
            Delete
          </LinkButton>
        </ActionsWrap>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const toolBarRender = [
    <Button
      key="1"
      type="primary"
      disabled={!hasSelected}
      onClick={() => {
        batchDelete(selectedRowKeys.join(','));
      }}
    >
      Batch delete
    </Button>,
    <Button
      key="2"
      type="primary"
      disabled={!hasSelected}
      onClick={() => {
        batchBlocked(selectedRowKeys.join(','), false);
      }}
    >
      Batch Block
    </Button>,
    <ModalForm<{
      // 是否开启禁止发贴功能
      postCreateBlockedEnabled?: boolean;
      // 设置帖子被标记多次则禁止用户发贴
      postCreateBlockedNumber?: number;
    }>
      key="3"
      width={630}
      title="Global Posting Configuration"
      trigger={
        <Button
          type="primary"
          loading={submitLoading}
          onClick={() => {
            setModalVisible(true);
          }}
        >
          Global Posting Configuration
        </Button>
      }
      form={form}
      open={modalVisible}
      onOpenChange={(open) => setModalVisible(open)}
      layout="horizontal"
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      initialValues={{
        ...postConfig?.data,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        setSubmitLoading(true);
        await putContentManagePostCreateConfig({
          ...values,
        })
          .then((res) => {
            if (res.code === 0) {
              message.success('Success');
            } else {
              message.error(res.msg);
            }
          })
          .finally(() => {
            setSubmitLoading(false);
            setModalVisible(false);
          });
      }}
    >
      <ProFormSwitch
        label="Prohibit Posting"
        name="postCreateBlockedEnabled"
        required
      />
      <ProFormDigit
        label="Number of Times a User is Marked for Prohibited Posting"
        name="postCreateBlockedNumber"
        fieldProps={{ precision: 0 }}
        required
      />
    </ModalForm>,
  ];

  return (
    <PageContainer title={'Post List'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<Post>
          rowSelection={rowSelection}
          headerTitle="Post List"
          actionRef={actionRef}
          rowKey={'id'}
          search={{
            defaultCollapsed: false, // 默认不折叠
            labelWidth: 'auto',
            span: 12,
          }}
          toolBarRender={() => toolBarRender}
          request={async (params) => {
            const newParams: any = {
              ...params,
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
            };
            delete newParams.size;
            delete newParams.current;

            const {
              data: { list, total },
            } = await getContentManagePostList({
              ...newParams,
            });

            return {
              data: list || [],
              success: true,
              total,
            };
          }}
          columns={columns}
          dateFormatter="string"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
        />
      </ProCard>
    </PageContainer>
  );
};
