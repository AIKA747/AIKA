import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import {
  deleteAdminUserId,
  getAdminUsers,
  patchAdminUserId,
} from '@/services/api/guanliyuanguanli';
import { getAdminRoles } from '@/services/api/quanxianguanli';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';

interface AdminUsers {
  id?: number;
  username?: string;
  nickname?: string;
  createdAt?: string;
  roleId?: number;
  roleName?: string;
  avatar?: string;
  userStatus?: string;
}

export default () => {
  const actionRef = useRef<ActionType>();

  // 获取角色列表
  const { data: adminRoleList } = useRequest(
    () => getAdminRoles({ pageNo: 1, pageSize: 99999 }),
    {
      manual: false,
    },
  );

  const columns: ProColumns<AdminUsers>[] = [
    {
      title: 'Username',
      dataIndex: 'username',
      editable: false,
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'nickname',
      editable: false,
      align: 'center',
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      editable: false,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: 'Role',
      dataIndex: 'roleId',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: (adminRoleList?.data?.list || []).map((x: any) => {
          return {
            value: x.id,
            label: x.roleName,
          };
        }),
      },
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
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            minCreatedTime: `${value[0]} 00:00:00`,
            maxCreatedTime: `${value[1]} 23:59:59`,
          };
        },
      },
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: 'option',
      fixed: 'right',
      width: 220,
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => {
              history.push('/systemManagement/adminManagement/' + record.id);
            }}
          >
            Edit
          </LinkButton>
          <LinkButton
            onClick={() => {
              Modal.confirm({
                title: `Are you sure reset the password?`,
                icon: <ExclamationCircleFilled />,
                onOk: () => {
                  if (record.id) {
                    const hide = message.loading('loading...', 0);
                    patchAdminUserId({
                      id: record.id,
                    }).then((res) => {
                      hide();
                      if (res.code === 0) {
                        message.success(
                          'Operation successful，About to refresh',
                          1.5,
                          () => {
                            actionRef.current?.reload();
                          },
                        );
                      } else {
                        message.error(res.msg);
                      }
                    });
                  }
                },
              });
            }}
          >
            Reset password
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
                    deleteAdminUserId({
                      id: record.id,
                    }).then((res) => {
                      hide();
                      if (res.code === 0) {
                        message.success(
                          'Operation successful，About to refresh',
                          1.5,
                          () => {
                            actionRef.current?.reload();
                          },
                        );
                      } else {
                        message.error(res.msg);
                      }
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
    <PageContainer title={'Admin management'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<AdminUsers>
          actionRef={actionRef}
          rowKey="id"
          headerTitle="Admin list"
          search={{
            labelWidth: 100,
          }}
          options={false}
          toolBarRender={() => [
            <Button
              key={'export'}
              type="primary"
              onClick={() => {
                history.push('/systemManagement/adminManagement/new');
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
            } = await getAdminUsers({
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
