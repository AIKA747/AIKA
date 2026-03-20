import ActionsWrap from '@/components/ActionsWrap';
// import AvatarCropUpload from '@/components/AvatarCropUpload';
import LinkButton from '@/components/LinkButton';
import Types from '@/pages/Sphere/Edit/Types';
import { getBotManageCategory } from '@/services/api/leixinglanmuguanli';
import {
  deleteBotManageSphereId,
  getBotManageSphere,
  postBotManageSphere,
  putBotManageSphere,
} from '@/services/api/spherexin';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProCard,
  ProColumns,
  ProForm,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Form, message, Modal } from 'antd';
import { useRef, useState } from 'react';

export default () => {
  const actionRef = useRef<ActionType>();

  const [form] = Form.useForm<{
    id?: number;
    // avatar: UploadFile[];
    collectionName: string;
    typeAndCate: { type: string; category: number };
    groupId?: string;
  }>();

  const [editVisible, setEditVisible] = useState<boolean>(false);

  const [CategoriesMap, setCategoriesMap] = useState({});

  useRequest(() => getBotManageCategory({ pageNo: 1, pageSize: 999 }), {
    manual: false,
    onSuccess(res) {
      if (res.code === 0) {
        setCategoriesMap(
          res.data.list.reduce((oldV, newV) => {
            return {
              ...oldV,
              [newV.categoryId]: newV.categoryName,
            };
          }, {}),
        );
      }
    },
  });

  const columns: ProColumns<API.BotCollection>[] = [
    {
      title: 'Name',
      dataIndex: 'collectionName',
      editable: false,
      align: 'left',
      render: (_v, record) =>
        record?.collectionName ? <span>{record?.collectionName}</span> : '-',
      hideInSearch: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      editable: false,
      align: 'left',
      hideInSearch: true,
      render: (_v, record) => {
        if (record?.type === 'GROUP_CHAT') return 'Group Chat';
        const arr = [record?.type];
        if (record?.type === 'EXPERT') {
          arr.push(`${CategoriesMap[record.category] || 'nobound'}`);
        }
        return arr.join('/');
      },
    },
    {
      title: 'Bots',
      dataIndex: 'botCount',
      editable: false,
      align: 'left',
      hideInSearch: true,
      render: (t, record) => (record.type === 'GROUP_CHAT' ? '-' : t),
    },
    // {
    //   title: 'Cover',
    //   dataIndex: 'avatar',
    //   editable: false,
    //   hideInSearch: true,
    //   align: 'left',
    //   render: (_v, record) => {
    //     return <Image width={100} src={record.avatar} />;
    //   },
    // },

    {
      title: 'Action',
      align: 'right',
      dataIndex: 'option',
      fixed: 'right',
      width: 280,
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={async () => {
              history.push(
                `/sphere/bot-manage/${record.id}/${
                  record.type
                }?name=${encodeURIComponent(record.collectionName)}${
                  record.type === 'EXPERT' && record.category !== '0'
                    ? `&categoryId=${
                        record.category
                      }&category=${encodeURIComponent(
                        CategoriesMap[record.category],
                      )}`
                    : ''
                }`,
              );
            }}
          >
            {record.type === 'GROUP_CHAT' ? 'Group' : 'Bots'} management
          </LinkButton>

          <LinkButton
            onClick={async () => {
              form.setFieldsValue({
                id: record.id,
                // avatar: [{ url: record.avatar }],
                collectionName: record.collectionName,
                typeAndCate: { type: record.type, category: record.category },
              });
              setEditVisible(true);
              // if (record.type === 'GROUP_CHAT') {
              //   const res = await getBotManageSphereBot({
              //     collectionId: record.id,
              //   });
              //   if (res.data?.list?.[0]?.botId) {
              //     //
              //   }
              // }
            }}
          >
            Edit
          </LinkButton>

          <LinkButton
            onClick={() => {
              Modal.confirm({
                title: 'warning',
                content: 'Confirm to delete?',
                onOk: async () =>
                  deleteBotManageSphereId({ id: '' + record.id }).then(
                    (res) => {
                      if (res?.code !== 0) {
                        message.error(res?.msg || 'failed');
                        return Promise.reject(res?.msg || 'failed');
                      } else {
                        actionRef?.current?.reload();
                      }
                    },
                  ),
              });
            }}
            type="primary"
            style={{ color: 'red' }}
          >
            {'Delete'}
          </LinkButton>
        </ActionsWrap>
      ),
    },
  ];

  return (
    <PageContainer
      title={'Sphere management'}
      extra={
        <Button type="primary" onClick={() => setEditVisible(true)}>
          Add new
        </Button>
      }
    >
      <ProCard title={'List'} style={{ marginBlockEnd: 24 }}>
        <ProTable<API.BotCollection>
          actionRef={actionRef}
          rowKey="id"
          search={false}
          // options={false}
          request={async (params) => {
            const newParams: any = {
              ...params,
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
            };
            delete newParams.size;
            delete newParams.current;
            delete newParams.pageSize;
            delete newParams.pageNo;

            const {
              data: { list, total },
            } = await getBotManageSphere({
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

      <ModalForm
        width={666}
        title={form.getFieldValue('id') ? 'Edit' : 'New'}
        form={form}
        open={editVisible}
        layout="horizontal"
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setEditVisible(false),
          afterClose: () => form.resetFields(),
        }}
        onFinish={async (values) => {
          // const avatar =
          //   values.avatar?.[0]?.response?.data || values.avatar?.[0]?.url;
          // if (!avatar) return;

          const params = {
            id: values.id,
            collectionName: values.collectionName,
            type: values.typeAndCate.type,
            category: values.typeAndCate.category,
            avatar: 'null',
          };

          let res: { code: number; msg?: string; data?: any };
          if (params.id) {
            res = await putBotManageSphere({ ...params, id: params.id! });
          } else {
            res = await postBotManageSphere(params);
          }
          if (res?.code === 0) {
            // // 如果类型是群聊，这里继续进行群聊选择绑定
            // if (values.typeAndCate.type === 'GROUP_CHAT' && values.groupId) {
            //   const groupRes = await postBotManageSphereBot({
            //     botId: values.groupId as any,
            //     type: 'GROUP_CHAT',
            //     collectionId: params.id || res.data?.id,
            //     name: 'null',
            //     listCover: 'null',
            //     description: 'null',
            //     avatar: 'null',
            //     listCoverDark: 'null',
            //   });
            //   if (groupRes?.code !== 0)
            //     return message.error(groupRes?.msg || 'error');
            // }

            message.success('succeed');
            setEditVisible(false);
            actionRef.current?.reload();
          } else {
            message.error(res?.msg || 'error');
          }
        }}
      >
        <ProFormText
          width="md"
          name="collectionName"
          label="Name"
          placeholder="Please input"
          rules={[{ required: true, message: 'Please input' }]}
          labelCol={{ span: 6 }}
        />

        {/*<ProForm.Item*/}
        {/*  name="avatar"*/}
        {/*  label="Avatar"*/}
        {/*  labelCol={{ span: 6 }}*/}
        {/*  rules={[*/}
        {/*    { required: true, message: 'Please upload avatar' },*/}
        {/*    {*/}
        {/*      validator: (_, value) => {*/}
        {/*        // prettier-ignore*/}
        {/*        if (value?.[0]?.status === 'error') return Promise.reject(new Error('Upload error, please try again.'));*/}
        {/*        else return Promise.resolve();*/}
        {/*      },*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*>*/}
        {/*  <AvatarCropUpload />*/}
        {/*</ProForm.Item>*/}

        <ProForm.Item
          name="typeAndCate"
          label="Type"
          rules={[{ required: true, message: 'Please select' }]}
          labelCol={{ span: 6 }}
        >
          <Types disabled={!!form.getFieldValue('id')} />
        </ProForm.Item>

        {/*{form.getFieldValue('typeAndCate')?.type === 'GROUP_CHAT' &&*/}
        {/*  (form.getFieldValue('id') ? (*/}
        {/*    curSphereGroup ? (*/}
        {/*      <ProForm.Item*/}
        {/*        name="typeAndCate"*/}
        {/*        label="Type"*/}
        {/*        rules={[{ required: true, message: 'Please select' }]}*/}
        {/*        labelCol={{ span: 6 }}*/}
        {/*      >*/}
        {/*        <div>*/}
        {/*          {curSphereGroup[0].label}&emsp;*/}
        {/*          <Button type="link" danger>*/}
        {/*            X*/}
        {/*          </Button>*/}
        {/*        </div>*/}
        {/*      </ProForm.Item>*/}
        {/*    ) : null*/}
        {/*  ) : (*/}
        {/*    <ProFormSelect*/}
        {/*      name="groupId"*/}
        {/*      label="Group Chat"*/}
        {/*      rules={[{ required: true, message: 'Please select' }]}*/}
        {/*      labelCol={{ span: 6 }}*/}
        {/*      showSearch*/}
        {/*      debounceTime={500}*/}
        {/*      request={(params) =>*/}
        {/*        params.keyWords.trim()*/}
        {/*          ? getBotManageGroupChatroomList({*/}
        {/*              searchContent: params.keyWords,*/}
        {/*              pageSize: 100,*/}
        {/*            }).then((res) =>*/}
        {/*              res?.data?.list?.map((item) => ({*/}
        {/*                label: `${item.roomName} (${item.description})`,*/}
        {/*                value: item.id,*/}
        {/*              })),*/}
        {/*            )*/}
        {/*          : Promise.resolve([])*/}
        {/*      }*/}
        {/*    />*/}
        {/*  ))}*/}

        <ProFormText name="id" hidden />
      </ModalForm>
    </PageContainer>
  );
};
