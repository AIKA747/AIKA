import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import {
  deleteAdminRoleId,
  getAdminRoles,
} from '@/services/api/quanxianguanli';
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

interface AdminRoles {
  id?: number;
  rolename?: string;
  createdAt?: string;
}

export default () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<AdminRoles>[] = [
    {
      title: 'Role name',
      dataIndex: 'roleName',
      editable: false,
      align: 'center',
      hideInSearch: true,
      width: 60,
    },
    {
      title: 'Created time',
      dataIndex: 'createdAt',
      align: 'center',
      editable: false,
      hideInSearch: true,
      width: 100,
      render: (_v, record: any) =>
        record?.createdAt
          ? dayjs(record?.createdAt).format('YYYY-MM-DD HH:mm:ss')
          : '-',
    },
    {
      title: 'Action',
      dataIndex: 'option',
      fixed: 'right',
      width: 150,
      align: 'center',
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => {
              history.push(
                '/systemManagement/permissionManagement/' + record.id,
              );
            }}
          >
            Edit
          </LinkButton>
          <LinkButton
            onClick={() => {
              Modal.confirm({
                title: `Are you sure delete this item?`,
                icon: <ExclamationCircleFilled />,
                okType: 'danger',
                onOk: () => {
                  if (record.id) {
                    const hide = message.loading('loading...', 0);
                    deleteAdminRoleId({
                      id: record.id,
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
                  }
                },
              });
            }}
          >
            Delete
          </LinkButton>
        </ActionsWrap>
      ),
    },
  ];

  return (
    <PageContainer title={'Permission management'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<AdminRoles>
          actionRef={actionRef}
          rowKey="id"
          headerTitle="Role Management"
          search={false}
          options={false}
          toolBarRender={() => [
            <Button
              key={'export'}
              type="primary"
              onClick={() => {
                history.push('/systemManagement/permissionManagement/new');
              }}
            >
              Add New
            </Button>,
          ]}
          request={async (params) => {
            const {
              data: { list, total },
            } = await getAdminRoles({
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
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
