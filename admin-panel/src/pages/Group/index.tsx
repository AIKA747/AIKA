import ActionsWrap from '@/components/ActionsWrap';
import AvatarCropUpload from '@/components/AvatarCropUpload';
import LinkButton from '@/components/LinkButton';
import {
  deleteBotManageGroupChatroomId,
  getBotManageGroupChatroomList,
  postBotManageGroupChatroom,
  putBotManageGroupChatroom,
} from '@/services/api/qunliguanlixin';
import { getUserManageUser } from '@/services/api/userService';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProCard,
  ProColumns,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Form, Image, message, Modal, UploadFile } from 'antd';
import { useRef, useState } from 'react';

type Member = Awaited<
  ReturnType<typeof getUserManageUser>
>['data']['list'][number];

type Record = Awaited<
  ReturnType<typeof getBotManageGroupChatroomList>
>['data']['list'][number];

export default function GroupMGT() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const source = urlParams.get('source');

  const actionRef = useRef<ActionType>();

  const [form] = Form.useForm<{
    id?: string;
    roomName: string;
    roomAvatar: UploadFile[];
    description: string;
    ownerId: string;
  }>();

  const [editVisible, setEditVisible] = useState<boolean>(false);

  const [memberMgtVisible, setMemberMgtVisible] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ProColumns<Record>[] = [
    {
      title: 'Name',
      dataIndex: 'roomName',
      editable: false,
      align: 'left',
    },
    {
      title: 'Avatar',
      dataIndex: 'roomAvatar',
      editable: false,
      align: 'left',
      render: (_v, record) => {
        return <Image width={64} src={record.roomAvatar} />;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      editable: false,
      align: 'left',
      render: (t) => (t?.length > 120 ? t.slice(0, 120) + '...' : t),
    },
    {
      title: 'Action',
      align: 'left',
      dataIndex: 'option',
      fixed: 'right',
      width: 280,
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => history.push(`/group/${record.id}/member`)}
          >
            Member management
          </LinkButton>

          <LinkButton
            onClick={() => {
              form.setFieldsValue({
                id: record.id,
                roomName: record.roomName,
                roomAvatar: [{ url: record.roomAvatar }],
                description: record.description,
                // ownerId: record.ownerId,
              });
              setEditVisible(true);
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
                  deleteBotManageGroupChatroomId({ id: '' + record.id }).then(
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
      title={'Group management'}
      extra={
        <>
          <Button type="primary" onClick={() => setEditVisible(true)}>
            Add new
          </Button>
          {source === 'sphere' && (
            <Button onClick={() => history.back()}>Back</Button>
          )}
        </>
      }
    >
      <ProCard title={'Group List'} style={{ marginBlockEnd: 24 }}>
        <ProTable<Record>
          actionRef={actionRef}
          rowKey="id"
          search={false}
          // options={false}
          request={async (params) => {
            const {
              data: { list, total },
            } = await getBotManageGroupChatroomList({
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
            });
            return { data: list || [], success: true, total };
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
        title={form.getFieldValue('id') ? 'Edit Group' : 'New Group'}
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
          const avatar =
            values.roomAvatar?.[0]?.response?.data ||
            values.roomAvatar?.[0]?.url;
          if (!avatar) return;

          const params = {
            id: values.id,
            roomName: values.roomName.trim(),
            roomAvatar: avatar,
            description: values.description.trim(),
            ownerId: values.id ? undefined : values.ownerId!,
          };

          let res: { code: number; msg?: string };
          if (params.id) {
            res = await putBotManageGroupChatroom(params);
          } else {
            res = await postBotManageGroupChatroom(params);
          }
          if (res?.code === 0) {
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
          name="roomName"
          label="Name"
          placeholder="Please input"
          rules={[
            { required: true, whitespace: true, message: 'Please input' },
          ]}
          labelCol={{ span: 6 }}
        />

        <ProFormTextArea
          width="md"
          name="description"
          label="Description"
          placeholder="Please input"
          rules={[
            { required: true, whitespace: true, message: 'Please input' },
          ]}
          labelCol={{ span: 6 }}
        />

        <ProForm.Item
          name="roomAvatar"
          label="Avatar"
          labelCol={{ span: 6 }}
          rules={[
            { required: true, message: 'Please upload avatar' },
            {
              validator: (_, value) => {
                // prettier-ignore
                if (value?.[0]?.status === 'error') return Promise.reject(new Error('Upload error, please try again.'));
                else return Promise.resolve();
              },
            },
          ]}
        >
          <AvatarCropUpload />
        </ProForm.Item>

        {!form.getFieldValue('id') && (
          <ProFormSelect
            name="ownerId"
            label="Owner"
            rules={[{ required: true, message: 'Please select' }]}
            labelCol={{ span: 6 }}
            showSearch
            debounceTime={500}
            request={(params) =>
              params.keyWords.trim()
                ? getUserManageUser({
                    username: params.keyWords,
                    pageSize: 100,
                    status: 'enabled',
                  }).then((res) =>
                    res?.data?.list?.map((item) => ({
                      label: `${item.nickname} (@${item.username})`,
                      value: item.id,
                    })),
                  )
                : Promise.resolve([])
            }
          />
        )}

        <ProFormText name="id" hidden />
      </ModalForm>

      {/* 群成员选择弹窗 */}
      <Modal
        width={800}
        title="Select Members"
        open={memberMgtVisible}
        onCancel={() => setMemberMgtVisible(false)}
      >
        <ProTable<Member>
          rowKey={'id'}
          columns={[
            { title: 'Name', dataIndex: 'username' },
            { title: 'email', dataIndex: 'email', hideInSearch: true },
          ]}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
          }}
          toolBarRender={false}
          pagination={{ defaultPageSize: 10, showSizeChanger: true }}
          request={async (params) => {
            const {
              data: { list, total },
            } = await getUserManageUser({
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
              username: params.username,
              status: 'enabled',
            });
            return { data: list || [], success: true, total };
          }}
        />
      </Modal>
    </PageContainer>
  );
}
