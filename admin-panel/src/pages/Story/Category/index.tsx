import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import {
  deleteContentManageCategoryId,
  getContentManageCategory,
} from '@/services/api/gushifenleiguanlixin';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Form, message, Modal } from 'antd';
import { useRef, useState } from 'react';
import EditForm from './ModelForm';

interface CategoryType {
  id?: number;
  project: string;
  weight: string;
}

export default () => {
  const actionRef = useRef<ActionType>();
  const [isOpen, setOpen] = useState(false);
  const [id, setId] = useState(false);
  const [form] = Form.useForm<{ project: string }>();

  const columns: ProColumns<CategoryType>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: false,
      align: 'left',
    },
    {
      title: 'Sort weight',
      dataIndex: 'weight',
      editable: false,
      align: 'left',
    },

    {
      title: 'Action',
      align: 'left',
      dataIndex: 'option',
      fixed: 'right',
      width: 220,
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => {
              setOpen(true);
              setId(record.id);
              form.setFieldsValue(record);
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
                    deleteContentManageCategoryId({
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
    <PageContainer title={'Category'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<CategoryType>
          actionRef={actionRef}
          rowKey="id"
          headerTitle="Category List"
          search={{
            labelWidth: 100,
          }}
          options={false}
          toolBarRender={() => [
            <Button
              key={'export'}
              type="primary"
              onClick={() => {
                setOpen(true);
                form.setFieldsValue({});
                // formRef.current?.setFieldsValue({ project: '123' }) // 不得行
                setId(null);
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
            } = await getContentManageCategory({
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
        <EditForm
          id={id}
          isOpen={isOpen}
          setOpen={setOpen}
          form={form}
          actionRef={actionRef}
        />
      </ProCard>
    </PageContainer>
  );
};
