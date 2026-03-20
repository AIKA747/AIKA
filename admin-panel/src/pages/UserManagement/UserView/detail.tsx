import {
  deleteUserManageGroupUser,
  getUserManageGroup,
  getUserManageUserId,
  postUserManageUserGroups,
} from '@/services/api/userService';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProCard,
  ProFormSelect,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import type { DescriptionsProps } from 'antd';
import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Form,
  message,
  Modal,
  Row,
  Space,
  Statistic,
  Tag,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

export default () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<{ groupIds: string[] }>();
  const [groupRender, setGroupRender] = useState<
    { groupId?: string; groupName?: string }[]
  >([]);

  //   获取用户组列表
  const { data: userGroupSource } = useRequest(
    () =>
      getUserManageGroup({
        pageNo: 1,
        pageSize: 99999,
      }),
    {
      manual: false,
    },
  );

  // 获取用户详情
  const {
    data,
    loading,
    run: getUserDetails,
  } = useRequest(
    () =>
      getUserManageUserId({
        id: id + '',
      }),
    {
      manual: !id,
      onSuccess: (response) => {
        if (response.code === 0) {
          setGroupRender(response?.data?.group || []);
        } else {
          message.error(response.msg);
        }
      },
    },
  );

  // 组移除用户
  const handleGroupClose = (item: any) => {
    if (id) {
      Modal.confirm({
        title: `Are you sure delete this item?`,
        icon: <ExclamationCircleFilled />,
        okType: 'danger',
        onOk: () => {
          const hide = message.loading('loading...', 0);
          deleteUserManageGroupUser({
            groupId: item.id,
            userIds: [id],
          }).then((res) => {
            hide();
            if (res.code === 0) {
              message.success('Success');
              const tempData = [...groupRender];
              const index = tempData.findIndex(
                (x) => x.groupId === item.groupId,
              );
              if (index !== -1) {
                tempData.splice(index, 1);
                setGroupRender(tempData);
              }
            } else {
              message.error(res.msg);
            }
          });
        },
      });
    }
  };

  // User Infomation
  const userInfomationItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Userame',
      children: data?.data?.username || '-',
    },
    {
      key: '3',
      label: 'Country',
      children: data?.data?.country || '-',
    },
    {
      key: '4',
      label: 'Avatar',
      children: <Avatar size={86} src={data?.data?.avatar} />,
    },
    {
      key: '5',
      label: 'Gender',
      children: data?.data?.gender || '-',
    },
    {
      key: '7',
      label: 'Email',
      children: data?.data?.email || '-',
    },
    {
      key: '9',
      label: 'Interest',
      children: (
        <Space size={[0, 8]} wrap>
          {(data?.data?.tags || []).map((item, index) => {
            return <Tag key={index}>{item}</Tag>;
          })}
        </Space>
      ),
    },
    {
      key: '10',
      label: 'Group',
      children: (
        <Space size={[0, 8]} wrap>
          {(groupRender || []).map((item: any) => {
            const tag = item.groupName;
            const isLongTag = tag.length > 15;
            const tagElem = (
              <Tag
                color="gold"
                key={item.id}
                // closable={index !== 0}
                closable
                onClose={(e) => {
                  e.preventDefault();
                  handleGroupClose(item);
                }}
              >
                {isLongTag ? `${tag.slice(0, 15)}...` : tag}
              </Tag>
            );

            if (isLongTag) {
              return (
                <Tooltip title={tag} key={item.id}>
                  {tagElem}
                </Tooltip>
              );
            } else {
              return tagElem;
            }
          })}
          <ModalForm<{
            groupIds: string[];
          }>
            title="Group setting"
            width={630}
            trigger={<Button type="link">+ group</Button>}
            form={form}
            layout="horizontal"
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              onCancel: () => {},
            }}
            initialValues={{
              groupIds: groupRender.map((ele) => ({
                value: ele.id,
                label: ele.groupName,
              })),
            }}
            submitTimeout={2000}
            onFinish={async (values) => {
              console.log(values);
              const res = await postUserManageUserGroups({
                groupIds: values.groupIds,
                userId: id + '',
              });
              if (res.code === 0) {
                message.success('Success');
                getUserDetails();
              } else {
                message.error(res.msg);
              }
              return true; // 关闭弹窗
            }}
          >
            <ProFormSelect
              mode="multiple"
              options={(userGroupSource?.data?.list || []).map((item: any) => {
                return {
                  value: item.id,
                  label: item.groupName,
                };
              })}
              rules={[{ required: true, message: 'Please select groups!' }]}
              width="md"
              name="groupIds"
              label="Please select groups:"
            />
          </ModalForm>
        </Space>
      ),
    },
    {
      key: '11',
      label: 'User status',
      children: data?.data?.status,
    },
  ];

  const labelStyle = {
    textAlign: 'right',
    width: 150,
    display: 'block',
    color: 'rgba(0, 0, 0, 0.88)',
  };
  const contentStyle = { paddingLeft: 26, width: 200 };

  const descriptionsTitle = (title: string) => (
    <div style={{ width: 142, textAlign: 'right' }}>{title}</div>
  );

  return (
    <PageContainer
      title={'View'}
      extra={
        <Space size="large">
          <Statistic title="Followers" value={data?.data?.followerTotal || 0} />
          <Statistic title="Created Bots" value={data?.data?.botTotal || 0} />
          <Statistic
            title="Subscribed Bots"
            value={data?.data?.subBotTotal || 0}
          />
          <Statistic title="Storys" value={data?.data?.storyTotal || 0} />
          <Button style={{ marginLeft: 80 }} onClick={() => history.back()}>
            Back
          </Button>
        </Space>
      }
    >
      <ProCard
        loading={loading}
        title={''}
        style={{ marginBlockEnd: 24, textAlign: 'center', paddingTop: 24 }}
      >
        <Row gutter={8}>
          <Col span={12}>
            <Descriptions
              style={{ borderRight: '1px solid #eee' }}
              column={1}
              title={descriptionsTitle('User Infomation')}
              items={userInfomationItems}
              labelStyle={labelStyle}
              contentStyle={contentStyle}
            />
          </Col>
          <Col span={10} offset={2}>
            {(data?.data?.packages || [])
              // .filter((x) => dayjs().isBefore(x.expiredDate))
              .map((item, index) => {
                return (
                  <Descriptions
                    style={{ marginBottom: 30 }}
                    key={index}
                    column={1}
                    title={
                      index === 0
                        ? descriptionsTitle('Plan Subscription Info')
                        : ''
                    }
                    items={[
                      {
                        key: '1',
                        label: 'Subscription time',
                        children: item.subscriptTime
                          ? dayjs(item.subscriptTime).format(
                              'YYYY-MM-DD HH:mm:ss',
                            )
                          : '-',
                      },
                      {
                        key: '2',
                        label: 'Subscribed Plan',
                        children: item.packageName || '-',
                      },
                      {
                        key: '3',
                        label: 'Expiration date',
                        children:
                          dayjs(item.expiredDate).format(
                            'YYYY-MM-DD hh:mm:ss',
                          ) || '-',
                      },
                      {
                        key: '4',
                        label: 'Subscription status',
                        children: (
                          <span style={{ color: '#159BDD' }}>
                            {item.expiredDate
                              ? dayjs().isBefore(item.expiredDate)
                                ? 'Valid'
                                : 'Expired'
                              : '-'}
                          </span>
                        ),
                      },
                    ]}
                    labelStyle={labelStyle}
                    contentStyle={contentStyle}
                  />
                );
              })}
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
};
