import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';

import {
  deleteUserManageGroupId,
  getUserManageGroup,
} from '@/services/api/userService';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';

interface Group {
  id?: string;
  groupName?: string;
  userCount?: string;
  createdAt?: string;
}
export default () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<Group>[] = [
    {
      title: 'Group name',
      dataIndex: 'groupName',
      editable: false,
      align: 'center',
    },
    {
      title: 'User count',
      dataIndex: 'userCount',
      editable: false,
      align: 'center',
      hideInSearch: true,
    },

    {
      title: 'Created time',
      dataIndex: 'createdAt',
      align: 'center',
      editable: false,
      render: (_v, record: any) =>
        record?.createdAt
          ? dayjs(record?.createdAt).format('YYYY-MM-DD HH:mm:ss')
          : '-',
      hideInSearch: true,
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => {
              history.push(
                '/userManagement/groupManagement/' +
                  record.id +
                  '/' +
                  record?.groupName,
              );
            }}
          >
            Edit
          </LinkButton>
          <LinkButton
            onClick={() => {
              if (record.id) {
                Modal.confirm({
                  title: `Are you sure delete this item?`,
                  icon: <ExclamationCircleFilled />,
                  okType: 'danger',
                  onOk: () => {
                    const hide = message.loading('loading...', 0);
                    deleteUserManageGroupId({
                      id: record.id + '',
                    }).then(() => {
                      hide();
                      message.success(
                        'Operation successful，About to refresh',
                        1.5,
                        () => {
                          actionRef.current?.reload();
                        },
                      );
                    });
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

  return (
    <PageContainer title={'Group management'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<Group>
          headerTitle="Group List"
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 100,
          }}
          options={false}
          toolBarRender={() => [
            <Button
              key="1"
              type="primary"
              onClick={() => {
                history.push('/userManagement/groupManagement/new/add');
              }}
            >
              Add New
            </Button>,
          ]}
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
            } = await getUserManageGroup({
              ...newParams,
            });

            return {
              data: list || [],
              success: true,
              total,
            };
          }}
          columns={columns}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
          dateFormatter="string"
        />
      </ProCard>
    </PageContainer>
  );
};
