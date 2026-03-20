import { getAdminMe } from '@/services/api/adminService';
import { getBotManageDic } from '@/services/api/botService';
import {
  getUserManageFeedbackId,
  patchUserManageFeedback,
  postUserManageFeedbackReply,
} from '@/services/api/yonghufankui';
import { getUuid } from '@/utils';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import {
  Button,
  Col,
  Descriptions,
  DescriptionsProps,
  Divider,
  Image,
  Input,
  message,
  Modal,
  Row,
  Space,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { DevicesList } from './devices';
const { Title } = Typography;
const { TextArea } = Input;

export default () => {
  const { id } = useParams<{ id: string }>();

  const { data: userData } = useRequest(getAdminMe);
  const { data: feedbackCategory } = useRequest(() =>
    getBotManageDic({ dicType: 'feedbackCategory' }),
  );

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState();

  const isImage = function (url: string) {
    if (!url) return false;
    if (['.jpg', '.png', '.jpeg'].some((ele) => url.endsWith(ele))) {
      return true;
    }
  };

  const isVideo = function (url: string) {
    if (!url) return false;
    if (['.mp4', '.mov'].some((ele) => url.endsWith(ele))) {
      return true;
    }
  };

  const [Detail, setDetail] = useState<any>();

  const isAuthorised = useMemo(() => {
    if (userData?.data.userId && Detail?.adminId) {
      if (Detail.adminId === 1000000) {
        return true; // 超级管理员
      } else {
        if (String(userData?.data.userId) === String(Detail.adminId)) {
          return true; // admin是该用户
        }
        return false;
      }
    }
    return false;
  }, [Detail, userData]);

  console.log(isAuthorised);

  const { loading, run } = useRequest(
    () => getUserManageFeedbackId({ id: String(id) }),
    {
      manual: !id || id === 'new',
      onSuccess(res) {
        const { images, replyImages } = res.data;
        setDetail({
          ...res.data,
          images: images?.map((ele) => ({ url: ele, id: getUuid() })),
          replyImages: replyImages?.map((ele) => ({ url: ele, id: getUuid() })),
        } as any);
      },
    },
  );

  const items0: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Issue ID',
      children:
        <div style={{ wordBreak: 'keep-all' }}>{Detail?.iuessId}</div> || '-',
    },
    {
      key: '2',
      label: 'Status',
      children: Detail?.status,
    },
  ];

  const items1: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Username',
      children: Detail?.username,
    },
    {
      key: '2',
      label: 'Email',
      children: Detail?.email,
    },
    {
      key: '3',
      label: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: 18,
            cursor: 'pointer',
          }}
          onClick={() => {
            setOpen(true);
          }}
        >
          <div>Device</div>
          <div
            style={{
              padding: 18,
              fontSize: 20,
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            ?
          </div>
        </div>
      ),
      children: Detail?.device,
    },
    {
      key: '4',
      label: 'System version',
      children: Detail?.systemVersion,
    },
  ];

  const items2: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Title',
      children: Detail?.title,
    },
    {
      key: '2',
      label: 'Category',
      children:
        feedbackCategory?.data.filter((ele) => ele.id === Detail?.category)[0]
          ?.dicValue || '--',
    },
    {
      key: '3',
      label: 'Submission time',
      children: Detail?.submissionAt
        ? dayjs(Detail?.submissionAt).format('YYYY-MM-DD HH:mm:ss')
        : '--',
    },
  ];

  const items3: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Description',
      children: Detail?.description,
    },
  ];

  // { url: 'https://aika-demo.s3.amazonaws.com/public/20240516/e01575df50bd4aa9aa120b5c4a867483.png' },
  const items4: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Attachment',
      children: (
        <Space direction="horizontal" size="middle" style={{ display: 'flex' }}>
          {[...(Detail?.images || []), { url: Detail?.video }].map((ele) => {
            if (isImage(ele.url)) {
              return (
                <Image
                  key={ele.url}
                  style={{ marginRight: 20 }}
                  width={200}
                  height={200}
                  src={ele.url}
                />
              );
            }
            if (isVideo(ele.url)) {
              return (
                <video
                  key={ele.url}
                  style={{ width: 200, height: 200 }}
                  src={ele.url}
                  controls
                ></video>
              );
            }
            return <></>;
          })}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title={'Detail'}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      {Detail?.status === 'underReview' && (
        <ProCard title={''} style={{ marginBlockEnd: 24 }} loading={loading}>
          <Row>
            <Col span={18}>
              <Title
                level={4}
              >{`Is the current user's request being processed?`}</Title>
            </Col>
            <Col span={6}>
              <Space size={20}>
                <Button
                  type="primary"
                  onClick={() => {
                    const hide = message.info('saving....');
                    patchUserManageFeedback({
                      id: Detail?.id,
                      status: 'pending',
                    }).then((res) => {
                      if (res.code === 0) {
                        hide();
                        message.success('succeed');
                        run();
                      } else {
                        message.error(res.msg);
                      }
                    });
                  }}
                >
                  Accept
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    const hide = message.info('saving....');
                    patchUserManageFeedback({
                      id: Detail?.id,
                      status: 'rejected',
                    }).then((res) => {
                      if (res.code === 0) {
                        hide();
                        message.success('rejected');
                        run();
                      } else {
                        message.error(res.msg);
                      }
                    });
                  }}
                >
                  Reject
                </Button>
              </Space>
            </Col>
          </Row>
        </ProCard>
      )}

      <Row style={{ marginTop: 30, marginBottom: 30 }}>
        <Col span={12}>
          <Descriptions
            title=""
            layout="horizontal"
            items={items0}
            column={2}
            // bordered
            labelStyle={{
              width: 80,
              display: 'block',
              textAlign: 'left',
              color: 'rgba(0, 0, 0, 0.88)',
              fontWeight: 550,
            }}
            contentStyle={{ paddingLeft: 0 }}
          />
        </Col>

        <Col span={12}>
          {Detail?.status === 'pending' && isAuthorised && (
            <Space size={20}>
              <Button
                type="primary"
                onClick={() => {
                  const hide = message.info('saving....');
                  patchUserManageFeedback({
                    id: Detail?.id,
                    status: 'underReview',
                  }).then((res) => {
                    if (res.code === 0) {
                      hide();
                      message.success('succeed');
                      run();
                    } else {
                      message.error(res.msg);
                    }
                  });
                }}
              >{`Change status to "Under review"`}</Button>
              <Button
                type="primary"
                onClick={() => {
                  if (!input) {
                    message.error(
                      "Fill in the response to the user's content.",
                    );
                    return;
                  }

                  const hide = message.info('saving....');
                  postUserManageFeedbackReply({
                    id: Detail?.id,
                    replyContent: input,
                  }).then((res) => {
                    if (res.code === 0) {
                      hide();
                      message.success('Success');
                      run();
                    } else {
                      message.error(res.msg);
                    }
                  });
                }}
              >
                Submit response
              </Button>
            </Space>
          )}
        </Col>
      </Row>

      <ProCard title={''} style={{ marginBlockEnd: 24 }} loading={loading}>
        <Descriptions
          title="User Information"
          layout="vertical"
          items={items1}
          column={4}
          bordered
          labelStyle={{
            width: 160,
            display: 'block',
            textAlign: 'left',
            color: 'rgba(0, 0, 0, 0.88)',
          }}
          contentStyle={{ paddingLeft: 0 }}
        />
      </ProCard>

      <ProCard title={''} style={{ marginBlockEnd: 24 }} loading={loading}>
        <Descriptions
          title="Content"
          layout="vertical"
          items={items2}
          column={3}
          bordered
          labelStyle={{
            width: 160,
            display: 'block',
            textAlign: 'left',
            color: 'rgba(0, 0, 0, 0.88)',
          }}
          contentStyle={{ paddingLeft: 0 }}
        />
        <Divider />
        <Descriptions
          title=""
          layout="vertical"
          items={items3}
          column={1}
          bordered
          labelStyle={{
            width: 160,
            display: 'block',
            textAlign: 'left',
            color: 'rgba(0, 0, 0, 0.88)',
          }}
          contentStyle={{ paddingLeft: 0 }}
          style={{ marginBottom: 20 }}
        />

        <Descriptions
          title=""
          layout="vertical"
          items={items4}
          column={1}
          bordered
          labelStyle={{
            width: 160,
            display: 'block',
            textAlign: 'left',
            color: 'rgba(0, 0, 0, 0.88)',
          }}
          contentStyle={{ paddingLeft: 0 }}
        />
      </ProCard>

      <ProCard title={'Reply'} style={{ marginBlockEnd: 24 }} loading={loading}>
        {Detail?.status === 'pending' && isAuthorised ? (
          <TextArea
            rows={4}
            placeholder="Up to 1500 characters at most."
            maxLength={1500}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        ) : (
          <div>{Detail?.replyContent}</div>
        )}
      </ProCard>

      <Modal
        title="Devices List"
        open={open}
        onCancel={() => setOpen(false)}
        cancelButtonProps={{
          style: { display: 'none' },
        }}
        okButtonProps={{
          style: { display: 'none' },
        }}
      >
        {DevicesList.split(';').map((ele: string, index: number) => (
          <p key={index}>{ele}</p>
        ))}
      </Modal>
    </PageContainer>
  );
};
