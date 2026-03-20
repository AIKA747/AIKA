import LinkButton from '@/components/LinkButton';
import {
  deleteBotManageCategoryId,
  getBotManageCategory,
  getBotManageCategoryId,
  putBotManageCategory,
} from '@/services/api/leixinglanmuguanli';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Divider, Form, message, Modal } from 'antd';
import { useRef } from 'react';

export default () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<{ sortNo: number }>();

  const columns = [
    {
      title: 'Category name',
      dataIndex: 'categoryName',
      width: 100,
    },
    // {
    //   title: 'Sort',
    //   dataIndex: 'sortNo',
    //   valueType: 'text',
    //   width: 60,
    //   // sorter: (a: any, b: any) => a.sortNo - b.sortNo,
    // },
    {
      title: 'Bot count',
      dataIndex: 'botCount',
      width: 80,
    },
    {
      title: 'Created time',
      dataIndex: 'createdAt',
      width: 100,
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value: any[]) => {
          return {
            from: `${value[0]} 00:00:00`,
            to: `${value[1]} 23:59:59`,
          };
        },
      },
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
      render: (_, record) => (
        <>
          {
            // predefined
            record && (
              <LinkButton
                onClick={() => {
                  history.push(`/bot/category/edit/${record.categoryId}`);
                }}
              >
                Edit
              </LinkButton>
            )
          }
          <Divider type="vertical" />

          <LinkButton
            onClick={() => {
              // handlePublish(record);
            }}
          >
            <ModalForm
              title="Sort"
              form={form}
              trigger={<span>Sort</span>}
              onOpenChange={async () => {
                const details = await getBotManageCategoryId({
                  id: record.categoryId,
                });
                console.log({ details });
                const { data = {} } = details;
                form.setFieldValue('sortNo', data.sortNo);
              }}
              onFinish={async (values) => {
                console.log(values);
                const { sortNo } = values;
                const hide = message.info('saving....');
                const details = await getBotManageCategoryId({
                  id: record.categoryId,
                });
                console.log({ details });
                const { data = {} } = details;
                form.setFieldValue('sortNo', data.sortNo);
                putBotManageCategory({
                  ...data,
                  sortNo,
                } as any)
                  .then((res) => {
                    if (res.code === 0) {
                      hide();
                      message.success('Success');
                      actionRef.current?.reload();
                    } else {
                      message.error(res.msg);
                    }
                  })
                  .catch(() => message.error('error'));
                form.resetFields();
                return true; //用于提交后关闭弹窗
              }}
            >
              <ProFormDigit
                width="md"
                name="sortNo"
                label="Please enter Sort No."
                placeholder="Please enter"
                min={1}
                // max={100}
              />
            </ModalForm>
          </LinkButton>

          <Divider type="vertical" />
          <LinkButton
            onClick={() => {
              Modal.confirm({
                title: 'warning',
                content: 'Is it confirmed to delete?',
                onOk() {
                  deleteBotManageCategoryId({
                    id: record.categoryId,
                  })
                    .then((res) => {
                      if (res.code === 0) {
                        message.success('Success');
                        actionRef.current?.reload();
                      } else {
                        message.error(res.msg);
                      }
                    })
                    .catch(() => {
                      message.error('error');
                    });
                },
              });
            }}
          >
            Delete
          </LinkButton>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserInfo>
        headerTitle="Catogery List"
        actionRef={actionRef}
        rowKey="categoryId"
        search={false}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => {
              history.push(`/bot/category/edit/new`);
            }}
          >
            Add New
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { data } = await getBotManageCategory({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
            pageNo: params.current || 1,
            pageSize: params.pageSize || 10,
          });
          return {
            data: data.list,
            total: data.total,
            success: true,
          };
        }}
        columns={columns as any}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
        }}
      />
    </PageContainer>
  );
};
