import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import {
  deleteBotManageSphereBotId,
  getBotManageSphereBot,
} from '@/services/api/spherexin';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Col, Form, Image, message, Modal, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import EditForm from './ModelForm';

export default () => {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  const category = urlParams.get('category');
  const categoryId = urlParams.get('categoryId');
  const { id, type } = useParams();

  const isGroupChatMGT = type === 'GROUP_CHAT';

  const displayCategory = isGroupChatMGT
    ? 'Group Chat'
    : (type ?? '') + (category ? ` / ${category}` : '');

  const actionRef = useRef<ActionType>();
  const [isOpen, setOpen] = useState(false);
  const [form] = Form.useForm<{ project: string }>();
  const [existingBotIds, setExistingBotIds] = useState<any[] | undefined>(
    undefined,
  );

  useRequest(async () => {
    const params = { pageNo: 1, pageSize: 999, collectionId: id };
    const res = await getBotManageSphereBot(params);
    setExistingBotIds(res?.data?.list.map((ele) => ele.botId) || []);
  });

  const columns: ProColumns<API.SphereBotDto>[] = [
    // {
    //   title: 'Tag',
    //   dataIndex: 'tag',
    //   editable: false,
    //   align: 'left',
    // },
    {
      title: 'Name',
      dataIndex: 'name',
      editable: false,
      align: 'left',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      editable: false,
      align: 'left',
      render: (text) =>
        text?.length > 100 ? text?.slice?.(0, 120) + '...' : text,
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      editable: false,
      hideInSearch: true,
      align: 'left',
      render: (_v, record) => {
        return <Image width={100} src={record.avatar} />;
      },
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
              Modal.confirm({
                title: `Are you sure delete this item?`,
                icon: <ExclamationCircleFilled />,
                okType: 'danger',
                onOk: () =>
                  deleteBotManageSphereBotId({ id: '' + record.id }).then(
                    (res) => {
                      if (res?.code === 0) {
                        actionRef.current?.reload();
                        setExistingBotIds((list) =>
                          list?.filter((id) => `${id}` !== `${record.botId}`),
                        );
                      } else {
                        message.error(res?.msg || 'failed');
                        return Promise.reject(res?.msg || 'failed');
                      }
                    },
                  ),
              });
            }}
          >
            Delete
          </LinkButton>
        </ActionsWrap>
      ),
    },
  ];

  useEffect(() => {
    if (category) {
      // setOpen(true); // 取消EXPERT+type下默认打开新增弹层
    }
  }, [category]);

  return (
    <PageContainer
      title={
        'Sphere / ' + (isGroupChatMGT ? 'Group management' : 'Bots management')
      }
      extra={
        <Button
          onClick={() => {
            history.back();
          }}
        >{`Back`}</Button>
      }
    >
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <p style={{ fontSize: 20 }}>Information</p>
        <Row>
          <Col span={6}>
            <span style={{ marginRight: 20 }}>name:</span>
            <span>{name}</span>
          </Col>
          <Col span={12}>
            <span style={{ marginRight: 20 }}>Category:</span>
            <span>{displayCategory}</span>
          </Col>
        </Row>
      </ProCard>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<API.SphereBotDto>
          actionRef={actionRef}
          rowKey="id"
          headerTitle="List"
          search={false}
          toolBarRender={() =>
            isGroupChatMGT &&
            (typeof existingBotIds === 'undefined' || existingBotIds.length)
              ? []
              : [
                  <Button
                    key="1"
                    type="default"
                    onClick={() => {
                      setOpen(true);
                      form.setFieldsValue({});
                      // formRef.current?.setFieldsValue({ project: '123' }) // 不得行
                      // setId(null);
                    }}
                  >
                    Add
                  </Button>,
                ]
          }
          request={async (params) => {
            const newParams: any = {
              ...params,
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
              collectionId: id,
            };
            delete newParams.size;
            delete newParams.current;

            const {
              data: { list, total },
            } = await getBotManageSphereBot({
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
          type={type}
          isOpen={isOpen}
          setOpen={setOpen}
          form={form}
          actionRef={actionRef}
          existingBotIds={existingBotIds}
          setExistingBotIds={setExistingBotIds}
          category={displayCategory}
          categoryId={categoryId}
        />
      </ProCard>
    </PageContainer>
  );
};
