import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import {
  deleteUserManageInterestItemId,
  getUserManageInterestItems,
  putUserManageInterestItem,
} from '@/services/api/xingquguanlixin';
import storage from '@/utils/storage';

import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProCard,
  ProColumns,
  ProFormDigit,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Form, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';

interface UserManageTag {
  id?: number;
  itemName?: string;
  orderNum?: number;
  createdAt?: string;
}
export default () => {
  const actionRef = useRef<ActionType>();

  const [form] = Form.useForm<{ orderNum: number }>();

  const columns: ProColumns<UserManageTag>[] = [
    {
      title: 'Tags name',
      dataIndex: 'itemName',
      editable: false,
      align: 'left',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'itemType',
      editable: false,
      align: 'left',
      valueEnum: {
        SPORT: 'SPORT',
        ENTERTAINMENT: 'ENTERTAINMENT',
        NEWS: 'NEWS',
        GAMING: 'GAMING',
        ARTISTIC: 'ARTISTIC',
        TECHNOLOGY: 'TECHNOLOGY & INNOVATION',
        LIFESTYLE: 'LIFESTYLE',
        SOCIAL: 'COMMUNITY & SOCIAL ISSUES',
      },
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Sort No.',
      dataIndex: 'orderNum',
      editable: false,
      align: 'left',
      hideInSearch: true,
      width: '10%',
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      editable: false,
      align: 'left',
      hideInSearch: true,
      width: '25%',
    },
    {
      title: 'Created time',
      dataIndex: 'createdAt',
      align: 'left',
      editable: false,
      width: '15%',
      render: (_v, record: any) =>
        record?.createdAt
          ? dayjs(record?.createdAt).format('YYYY-MM-DD HH:mm:ss')
          : '-',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: 'Action',
      align: 'left',
      dataIndex: 'option',
      fixed: 'right',
      hideInSearch: true,
      width: '20%',
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => {
              storage.set('interesttags-edit-info', record);
              history.push(
                '/systemManagement/dictionarySetting/interesttags/' + record.id,
              );
            }}
          >
            Edit
          </LinkButton>
          <ModalForm<{
            orderNum: number;
          }>
            width={630}
            title="Sort"
            trigger={<LinkButton>Sort</LinkButton>}
            form={form}
            layout="horizontal"
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              onCancel: () => console.log('run'),
            }}
            submitTimeout={2000}
            onOpenChange={async () => {
              form.setFieldValue('orderNum', record.orderNum);
            }}
            onFinish={async (values) => {
              await putUserManageInterestItem({
                ...record,
                orderNum: values.orderNum,
                id: record.id + '',
              }).then((res) => {
                if (res.code === 0) {
                  message.success('Success', 1.5, () => {
                    actionRef.current?.reload();
                  });
                } else {
                  message.error(res.msg);
                }
              });

              return true;
            }}
          >
            <ProFormDigit
              label="Please enter sort no."
              name="orderNum"
              min={1}
              fieldProps={{ precision: 0 }}
              rules={[{ required: true, message: 'Please enter sort no.!' }]}
              width="md"
            />
          </ModalForm>
          <LinkButton
            onClick={() => {
              if (record.id) {
                Modal.confirm({
                  title: `Are you sure delete this item?`,
                  icon: <ExclamationCircleFilled />,
                  okType: 'danger',
                  onOk: () => {
                    if (record.id) {
                      const hide = message.loading('loading...', 0);
                      deleteUserManageInterestItemId({
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
    <PageContainer title={'Interest tags'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<UserManageTag>
          headerTitle="Interest List"
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 100,
          }}
          // options={false}
          toolBarRender={() => [
            <Button
              key="1"
              type="primary"
              onClick={() => {
                history.push(
                  '/systemManagement/dictionarySetting/interesttags/new',
                );
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
            } = await getUserManageInterestItems({
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
