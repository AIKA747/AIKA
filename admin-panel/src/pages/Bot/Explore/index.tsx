import LinkButton from '@/components/LinkButton';
import {
  getBotManageBotIdRecommend,
  getBotManageBotRecommend,
  putBotManageBotIdUnrecommend,
  putBotManageBotRecommend,
  putBotManageBotRecommendSort,
} from '@/services/api/jiqirenguanli';
import { getBotManageCategory } from '@/services/api/leixinglanmuguanli';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Divider, Form, message, Typography } from 'antd';
import React, { useRef } from 'react';
const { Link } = Typography;

const TableList: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm<{ sortNo: number }>();

  const { data: catList } = useRequest(
    () => getBotManageCategory({ pageNo: 1, pageSize: 99999 }),
    {
      manual: false,
    },
  );

  const columns = [
    {
      title: 'Bot name',
      dataIndex: 'botName',
      width: 100,
      render: (_v, record) =>
        record?.botName ? (
          <Link href="" target="_blank">
            {record?.botName}
          </Link>
        ) : (
          '-'
        ),
    },
    {
      title: 'Category',
      dataIndex: 'Category',
      width: 60,
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: (catList?.data?.list || []).map((x: any) => {
          return {
            value: x.categoryId,
            label: x.categoryName,
          };
        }),
      },
      transform(v: any) {
        console.log(v);
        return {
          categoryId: v,
        };
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      valueType: 'text',
      width: 60,
      hideInSearch: true,
      render(rate) {
        console.log(rate);

        return Number(rate).toFixed(1);
      },
    },
    {
      title: 'Sort no',
      dataIndex: 'sortNo',
      valueType: 'text',
      width: 60,
      hideInSearch: true,
      sorter: (a: any, b: any) => a.count - b.count,
    },
    {
      title: 'Source',
      dataIndex: 'botSource',
      width: 80,
      valueEnum: {
        userCreated: 'User-created',
        builtIn: 'Built-in',
      },
    },
    {
      title: 'Recommended time',
      dataIndex: 'recommendTime',
      valueType: 'dateTime',
      width: 100,
      hideInSearch: true,
    },
    {
      title: 'Recommended time',
      dataIndex: 'recommendTime',
      valueType: 'dateRange',
      width: 100,
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            minRecommendTime: `${value[0]} 00:00:00`,
            maxRecommendTime: `${value[1]} 23:59:59`,
          };
        },
      },
    },
    // {
    //   title: 'Digital human',
    //   dataIndex: 'digitalHuman',
    //   hideInTable: true,
    //   valueEnum: {
    //     yes: 'yes',
    //     no: 'no',
    //   },
    //   width: 100,
    // },
    {
      title: 'action',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: (_, record) => (
        <>
          <LinkButton
            onClick={() => {
              console.log(record);
              history.push(`/bot/explore/edit/${record.id}`);
              // handlePublish(record);
            }}
          >
            Edit
          </LinkButton>
          <Divider type="vertical" />
          <LinkButton
            onClick={async () => {
              // handlePublish(record);
            }}
          >
            <ModalForm
              title="Sort1"
              form={form}
              trigger={<span>Sort</span>}
              onOpenChange={async () => {
                const details = await getBotManageBotIdRecommend({
                  id: record.id,
                });
                console.log({ details });
                const { data = {} } = details;
                form.setFieldValue('sortNo', data.sortNo);
              }}
              onFinish={async (values) => {
                console.log(values);
                const { sortNo } = values;
                const hide = message.info('saving....');
                putBotManageBotRecommendSort({
                  botId: record.id,
                  sortNo,
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
                  .catch((err) => message.error(err || res.msg));
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
                // max={10}
              />
            </ModalForm>
          </LinkButton>
          <Divider type="vertical" />
          {/* <br />
          <br /> */}
          <LinkButton
            onClick={async () => {
              const { sortNo, recommendImage, recommendWords, recommend } =
                record;
              const hide = message.info('saving....');
              const res = recommend
                ? await putBotManageBotIdUnrecommend({
                    id: record.id,
                  })
                : await putBotManageBotRecommend({
                    botId: record.id,
                    sortNo,
                    recommendImage,
                    recommendWords,
                  });
              if (res.code === 0) {
                hide();
                message.success('Success');
                actionRef.current?.reload();
              } else {
                message.error(res.msg || res.msg);
              }
            }}
          >
            {record.recommend ? 'Unrecommend' : 'Recommend'}
          </LinkButton>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserInfo>
        headerTitle="Recommended Bot List"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 180,
          collapsed: false,
        }}
        request={async (params, sorter, filter) => {
          console.log(params, sorter, filter);
          const { data, total } = await getBotManageBotRecommend({
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
            total,
            success: true,
          };
        }}
        columns={columns as any}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
          showSizeChanger: true,
        }}
      />
    </PageContainer>
  );
};

export default TableList;
