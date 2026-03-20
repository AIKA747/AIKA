import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import {
  getUserManageGroup,
  getUserManageSubscription,
  getUserManageUser,
  postUserManageGroupUser,
  putUserManageUserStatus,
} from '@/services/api/userService';
// import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProCard,
  ProColumns,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Badge, Button, Form, message, Modal, Radio } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

interface User {
  id?: string;
  username?: string;
  phone?: string;
  email?: string;
  gender?: string;
  status?: string;
  createdAt?: string;
  subscripting?: boolean;
}
interface UserManageSubscription {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  expiredDate?: string;
  subscriptTime?: string;
}

export default () => {
  const actionRef = useRef<ActionType>();

  const [userType, setUserType] = useState<string>(
    sessionStorage.getItem('userMng-user-type') || 'all',
  );

  const [form] = Form.useForm<{ groupId: number }>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  //   获取用户组列表
  const { data: userGroupList } = useRequest(
    () =>
      getUserManageGroup({
        pageNo: 1,
        pageSize: 99999,
      }),
    {
      manual: false,
    },
  );

  // All
  const columns: ProColumns<User>[] = [
    {
      title: 'Userame',
      dataIndex: 'username',
      editable: false,
      align: 'center',
    },
    {
      title: 'Email/Phone number',
      dataIndex: 'email',
      editable: false,
      align: 'center',
      hideInSearch: true,
      renderText: (v, record) =>
        `${v || ''}${record?.phone ? record?.phone + '/' : ''}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      editable: false,
      valueType: 'select',
      valueEnum: {
        enabled: 'Enabled',
        disabled: 'Disabled',
        uncompleted: 'Uncompleted',
      },
      align: 'left',
      render: (_v, record) => {
        const textmMap = {
          enabled: 'Enabled',
          disabled: 'Disabled',
          uncompleted: 'Uncompleted',
        };
        const statusMap = {
          enabled: 'success',
          disabled: 'warning',
          uncompleted: 'default',
        };
        return (
          <Badge
            status={statusMap[record?.status]}
            text={textmMap[record?.status]}
          />
        );
      },
    },
    // {
    //   title: 'Group',
    //   dataIndex: 'group',
    //   editable: false,
    //   hideInSearch: true,
    //   align: 'center',
    // },
    {
      title: 'Group',
      dataIndex: 'groupId',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: (userGroupList?.data?.list || []).map((item) => {
          return {
            value: item.id,
            label: item.groupName,
          };
        }),
      },
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      editable: false,
      hideInSearch: true,
      align: 'center',
    },

    {
      title: 'Email',
      dataIndex: 'email',
      hideInTable: true,
    },
    {
      title: 'Phone number',
      dataIndex: 'phone',
      hideInTable: true,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      hideInTable: true,
    },
    {
      title: 'Interest',
      dataIndex: 'tags',
      hideInTable: true,
    },
    {
      title: 'Gender',
      dataIndex: 'gender', //性别：'MALE','HIDE','FEMALE'
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        MALE: 'MALE',
        HIDE: 'HIDE',
        FEMALE: 'FEMALE',
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
            from: `${value[0]} 00:00:00`,
            to: `${value[1]} 23:59:59`,
          };
        },
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
              history.push('/userManagement/userView/' + record.id);
            }}
          >
            View
          </LinkButton>
          <LinkButton
            onClick={() => {
              if (record.id) {
                Modal.confirm({
                  title: `Are you sure change the status？`,
                  onOk: () => {
                    const hide = message.loading('loading...', 0);
                    putUserManageUserStatus({
                      userId: record.id + '',
                      status:
                        record.status === 'enabled' ? 'disabled' : 'enabled',
                    })
                      .then((res) => {
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
                      })
                      .catch(() => {
                        message.error('error');
                      });
                  },
                });
              }
            }}
          >
            {record.status === 'enabled' ? 'Ban' : 'Approve'}
          </LinkButton>
          {/* <LinkButton
            style={{display:'none'}}
            onClick={() => {
              if (record.id) {
                Modal.confirm({
                  title: `Are you sure delete this item?`,
                  icon: <ExclamationCircleFilled />,
                  okType: 'danger',
                  onOk: () => {
                    const hide = message.loading('loading...', 0);
                    deleteUserManageUserId({
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
          </LinkButton> */}
        </ActionsWrap>
      ),
    },
  ];

  // Subscribed 用户订阅列表columns
  const columnsSubscription: ProColumns<UserManageSubscription>[] = [
    {
      title: 'Userame',
      dataIndex: 'username',
      editable: false,
      align: 'center',
    },
    {
      title: 'Email/Phone number',
      dataIndex: 'email',
      editable: false,
      align: 'center',
      hideInSearch: true,
      renderText: (v, record) =>
        `${v || ''}${record?.phone ? record?.phone + '/' : ''}`,
    },
    {
      title: 'Expiration Date',
      dataIndex: 'expiredDate',
      align: 'center',
      editable: false,
      hideInSearch: true,
      render: (_v, record: any) =>
        record?.expiredDate
          ? dayjs(record?.expiredDate).format('YYYY-MM-DD HH:mm:ss')
          : '-',
    },
    {
      title: 'Subscription Status',
      dataIndex: 'subStatus', //Valid，Expired
      editable: false,
      valueType: 'select',
      valueEnum: {
        Valid: 'Valid',
        Expired: 'Expired',
      },
      align: 'center',
      render: (_v, record) => {
        return (
          <Badge
            status={
              dayjs().isBefore(record.expiredDate) ? 'success' : 'default'
            }
            text={dayjs().isBefore(record.expiredDate) ? 'Valid' : 'Expired'}
          />
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      hideInTable: true,
    },
    // {
    //   title: 'Phone number',
    //   dataIndex: 'phone',
    //   hideInTable: true,
    // },
    {
      title: 'Group',
      dataIndex: 'groupId',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: (userGroupList?.data?.list || []).map((item) => {
          return {
            value: item.id,
            label: item.groupName,
          };
        }),
      },
    },
    {
      title: 'RemainingTime',
      dataIndex: 'remainingDays', //剩余时间，单位：天（(90/30/7)）
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        7: '7 day',
        30: '30 day',
        90: '90 day',
      },
    },
    {
      title: 'Subscription Time',
      dataIndex: 'subscriptTime',
      align: 'center',
      editable: false,
      render: (_v, record: any) =>
        record?.subscriptTime
          ? dayjs(record?.subscriptTime).format('YYYY-MM-DD HH:mm:ss')
          : '-',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            minSubscriptionTime: `${value[0]} 00:00:00`,
            maxSubscriptionTime: `${value[1]} 23:59:59`,
          };
        },
      },
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
              history.push('/userManagement/userView/' + record.userId);
            }}
          >
            View
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
    <Radio.Group
      key="1"
      onChange={(e) => {
        setUserType(e.target.value);
        sessionStorage.setItem('userMng-user-type', e.target.value);
        setSelectedRowKeys([]);
        setSubmitLoading(false);
      }}
      value={userType}
    >
      <Radio.Button value="all">All</Radio.Button>
      <Radio.Button value="subscribed">Subscribed</Radio.Button>
    </Radio.Group>,
    <ModalForm<{
      groupId: number;
    }>
      key="2"
      width={630}
      title="Group setting"
      trigger={
        <Button
          type="primary"
          loading={submitLoading}
          disabled={submitLoading || !hasSelected}
        >
          Batch setting group
        </Button>
      }
      form={form}
      layout="horizontal"
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        if (selectedRowKeys && !!selectedRowKeys.length) {
          setSubmitLoading(true);
          await postUserManageGroupUser({
            groupId: values.groupId,
            userIds: selectedRowKeys,
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
              setSelectedRowKeys([]);
            });
        }

        return true;
      }}
    >
      <ProFormSelect
        options={(userGroupList?.data?.list || []).map((item: any) => {
          return {
            value: item.id,
            label: item.groupName,
          };
        })}
        rules={[{ required: true, message: 'Please select groups!' }]}
        width="md"
        name="groupId"
        label="Please select groups:"
      />
    </ModalForm>,
  ];

  return (
    <PageContainer title={'User View'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        {userType === 'all' ? (
          <ProTable<User>
            rowSelection={rowSelection}
            headerTitle="User List"
            actionRef={actionRef}
            rowKey={'id'}
            search={{
              labelWidth: 140,
            }}
            params={{ userType }}
            // options={false}
            toolBarRender={() => toolBarRender}
            request={async (params) => {
              const newParams: any = {
                ...params,
                pageNo: params.current || 1,
                pageSize: params.pageSize || 10,
              };
              delete newParams.size;
              delete newParams.current;
              delete newParams.userType;

              const {
                data: { list, total },
              } = await getUserManageUser({
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
        ) : (
          <ProTable<UserManageSubscription>
            rowSelection={rowSelection}
            headerTitle="User List"
            actionRef={actionRef}
            rowKey={'orderId'}
            search={{
              labelWidth: 130,
            }}
            params={{ userType }}
            // options={false}
            toolBarRender={() => toolBarRender}
            request={async (params) => {
              const newParams: any = {
                ...params,
                pageNo: params.current || 1,
                pageSize: params.pageSize || 10,
              };
              delete newParams.size;
              delete newParams.current;
              delete newParams.userType;

              const res = await getUserManageSubscription({
                ...newParams,
              });
              if (res.code === 0) {
                const {
                  data: { list, total },
                } = res;

                return {
                  data: list || [],
                  success: true,
                  total,
                };
              } else {
                message.error(res.msg || '');
                return {};
              }
            }}
            columns={columnsSubscription}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
            }}
            dateFormatter="string"
          />
        )}
      </ProCard>
    </PageContainer>
  );
};
