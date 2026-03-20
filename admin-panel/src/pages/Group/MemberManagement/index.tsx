import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import {
  deleteBotManageChatroomMembers,
  getBotManageChatroomMembers,
  getBotManageGroupChatroom,
  postBotManageChatroomMembers,
  putBotManageChatroomRole,
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
  ProTable,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Col, Form, Image, message, Modal, Row } from 'antd';
import { useRef, useState } from 'react';

type Member = Awaited<
  ReturnType<typeof getBotManageChatroomMembers>
>['data']['list'][number];

export default function GroupMGT() {
  const { id: roomId } = useParams();

  const { data: groupInfo, loading } = useRequest(async () => {
    const res = await getBotManageGroupChatroom({ id: roomId });
    return res?.data;
  });

  const [form] = Form.useForm<{ member: string }>();
  const [roleForm] = Form.useForm<{ role: string }>();

  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [curEdit, setCurEdit] = useState<Member>();

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<Member>[] = [
    { title: 'nickname', dataIndex: 'nickname' },
    { title: 'username', dataIndex: 'username', render: (t) => `@${t}` },
    { title: 'type', dataIndex: 'memberType' },
    { title: 'role', dataIndex: 'memberRole' },
    { title: 'status', dataIndex: 'status' },
    {
      title: 'Action',
      align: 'right',
      dataIndex: 'option',
      fixed: 'right',
      width: 180,
      hideInSearch: true,
      render: (_v, record) =>
        record.memberRole === 'OWNER' ? (
          '--'
        ) : (
          <ActionsWrap max={3}>
            <LinkButton
              onClick={() => {
                setCurEdit(record);
                roleForm.setFieldsValue({ role: record.memberRole });
              }}
            >
              Set Role
            </LinkButton>

            <LinkButton
              onClick={() => {
                Modal.confirm({
                  title: 'warning',
                  content: 'Confirm to delete?',
                  onOk: async () =>
                    deleteBotManageChatroomMembers({
                      roomId,
                      memberIds: [record.memberId],
                    }).then((res) => {
                      if (res?.code !== 0) {
                        message.error(res?.msg || 'failed');
                        return Promise.reject(res?.msg || 'failed');
                      } else {
                        actionRef.current?.reload();
                      }
                    }),
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
      title={'Group management / Member management'}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <ProCard
        title={'Group Info'}
        loading={loading}
        style={{ marginBlockEnd: 24 }}
      >
        <Row>
          <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 20 }}>Name:</span>
            <span>{groupInfo?.roomName || '-'}</span>
          </Col>
          <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 20 }}>Avatar:</span>
            <Image src={groupInfo?.roomAvatar} width={48} />
          </Col>
        </Row>
      </ProCard>

      <ProCard title={'Member List'} style={{ marginBlockEnd: 24 }}>
        <ProTable<Member>
          rowKey="id"
          search={false}
          columns={columns}
          actionRef={actionRef}
          request={async (params) => {
            const {
              data: { list, total },
            } = await getBotManageChatroomMembers({
              roomId,
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
            });
            return { data: list || [], success: true, total };
          }}
          pagination={{ defaultPageSize: 10, showSizeChanger: true }}
          toolBarRender={() => [
            <Button key="1" type="primary" onClick={() => setAddVisible(true)}>
              Add Member
            </Button>,
          ]}
        />
      </ProCard>

      {/* 添加群成员选择弹窗 */}
      <ModalForm
        width={500}
        title={'Add Member'}
        form={form}
        open={addVisible}
        layout="horizontal"
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setAddVisible(false),
          afterClose: () => form.resetFields(),
          bodyProps: { style: { paddingTop: 20 } },
        }}
        onFinish={async (values) => {
          const member = JSON.parse(values.member || '{}') as Member;
          if (!member.id) return;

          const params = {
            roomId,
            members: [
              {
                memberType: 'USER',
                memberId: member.id,
                avatar: member.avatar,
                nickname: member.nickname,
                username: member.username,
              },
            ],
          };

          const res = await postBotManageChatroomMembers(params);
          if (res?.code === 0) {
            actionRef.current?.reload();
            message.success('succeed');
            setAddVisible(false);
          } else {
            message.error(res?.msg || 'error');
          }
        }}
      >
        <ProFormSelect
          name="member"
          label="User"
          rules={[{ required: true, message: 'Please select' }]}
          showSearch
          placeholder="search by username."
          debounceTime={500}
          request={(params) =>
            params.keyWords.trim()
              ? getUserManageUser({
                  username: params.keyWords.replace('@', ''),
                  pageSize: 100,
                  status: 'enabled',
                }).then((res) =>
                  res?.data?.list?.map((item) => ({
                    label: `${item.nickname} (@${item.username})`,
                    value: JSON.stringify(item),
                  })),
                )
              : Promise.resolve([])
          }
        />
      </ModalForm>

      {/* 设置成员角色弹窗 */}
      <ModalForm
        width={600}
        title={'Set Role'}
        form={roleForm}
        open={!!curEdit}
        layout="horizontal"
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setCurEdit(undefined),
          afterClose: () => form.resetFields(),
          bodyProps: { style: { paddingTop: 20 } },
        }}
        onFinish={async (values) => {
          if (!curEdit?.memberId) return;

          const params = {
            roomId,
            role: values.role,
            memberIds: [curEdit.memberId],
          };

          const res = await putBotManageChatroomRole(params);
          if (res?.code === 0) {
            actionRef.current?.reload();
            message.success('succeed');
            setCurEdit(undefined);
          } else {
            message.error(res?.msg || 'error');
          }
        }}
      >
        <ProForm.Item label="User" labelCol={{ span: 6 }}>
          {curEdit?.nickname} (@{curEdit?.username})
        </ProForm.Item>

        <ProFormSelect
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select' }]}
          labelCol={{ span: 6 }}
          width={200}
          showSearch
          options={[
            { label: 'Admin', value: 'ADMIN' },
            { label: 'Moderator', value: 'MODERATOR' },
            { label: 'Member', value: 'MEMBER' },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
}
