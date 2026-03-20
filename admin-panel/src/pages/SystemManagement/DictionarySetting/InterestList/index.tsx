import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import {
  deleteUserManageTagId,
  getUserManageTags,
  patchUserManageTag,
} from '@/services/api/biaoqieguanli';

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
  tagName?: string;
  sortNo?: number;
  createdAt?: string;
}
export default () => {
  const actionRef = useRef<ActionType>();

  const [form] = Form.useForm<{ sortNo: number }>();

  const columns: ProColumns<UserManageTag>[] = [
    {
      title: 'Interest tag',
      dataIndex: 'tagName',
      editable: false,
      align: 'left',
    },
    {
      title: 'Sort No.',
      dataIndex: 'sortNo',
      editable: false,
      align: 'left',
      hideInSearch: true,
    },

    {
      title: 'Created time',
      dataIndex: 'createdAt',
      align: 'left',
      editable: false,
      render: (_v, record: any) =>
        record?.createdAt
          ? dayjs(record?.createdAt).format('YYYY-MM-DD HH:mm:ss')
          : '-',
      hideInSearch: true,
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
              history.push(
                '/systemManagement/dictionarySetting/interestList/' +
                  record.id +
                  '/' +
                  record.tagName,
              );
            }}
          >
            Edit
          </LinkButton>
          <ModalForm<{
            sortNo: number;
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
              form.setFieldValue('sortNo', record.sortNo);
            }}
            onFinish={async (values) => {
              await patchUserManageTag({
                sortNo: values.sortNo,
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
              name="sortNo"
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
                      deleteUserManageTagId({
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
          options={false}
          toolBarRender={() => [
            <Button
              key="1"
              type="primary"
              onClick={() => {
                history.push(
                  '/systemManagement/dictionarySetting/interestList/new/add',
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
            } = await getUserManageTags({
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
