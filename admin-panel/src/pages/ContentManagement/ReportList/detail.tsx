import {
  deleteContentManagePost,
  getContentManagePostDetail,
  putContentManagePostBlocked,
} from '@/services/api/tieziguanli';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import {
  Button,
  Col,
  Descriptions,
  Image,
  message,
  Modal,
  Row,
  Space,
  Statistic,
  Tag,
  Timeline,
} from 'antd';
import { useState } from 'react';

export default () => {
  const { id } = useParams<{ id: string }>();

  const [postDetail, setPostDetail] = useState<{
    title: string;
    summary: string;
    thread: { title: string; content: string; images: string[] }[];
    id: number;
    cover: string;
    topicTags: string;
    createdAt: string;
    updatedAt: string;
    author: number;
    type: string;
    likes: number;
    reposts: number;
    visits: number;
    keywords: string;
    recommendTags: string;
    blocked: boolean;
    flagged: boolean;
    categories: string[];
  }>();

  // 获取帖子详情
  const { loading } = useRequest(
    () =>
      getContentManagePostDetail({
        id: id,
      }),
    {
      manual: !id,
      onSuccess: (response) => {
        if (response.code === 0) {
          setPostDetail(response?.data);
        } else {
          message.error(response.msg);
        }
      },
    },
  );

  // post Information
  const postInformationItems = [
    {
      key: '1',
      label: 'Cover',
      children: (
        <Image style={{ width: 100 }} src={postDetail?.cover} alt="cover" />
      ),
    },
    {
      key: '2',
      label: 'Title',
      children: postDetail?.title || '-',
    },
    {
      key: '3',
      label: 'Summary',
      children: postDetail?.summary || '-',
    },
    {
      key: '4',
      label: 'Type',
      children: postDetail?.type || '-',
    },
    {
      key: '5',
      label: 'Status',
      children: (
        <Tag bordered={false} color={postDetail?.blocked ? 'error' : 'cyan'}>
          {postDetail?.blocked ? 'Blocked' : 'Public'}
        </Tag>
      ),
    },
    {
      key: '6',
      label: 'Flag',
      children: (
        <Tag bordered={false} color={postDetail?.flagged ? 'error' : 'cyan'}>
          {postDetail?.blocked ? 'Sensitive' : 'Non-sensitive'}
        </Tag>
      ),
    },
    {
      key: '7',
      label: 'TopicTags',
      children: (
        <Space size={[0, 8]} wrap>
          {(postDetail?.topicTags ? postDetail?.topicTags.split(',') : []).map(
            (item, index) => {
              return <Tag key={index}>{item}</Tag>;
            },
          )}
        </Space>
      ),
    },
    {
      key: '8',
      label: 'Keywords',
      children: (
        <Space size={[0, 8]} wrap>
          {(postDetail?.keywords ? postDetail?.keywords.split(',') : []).map(
            (item, index) => {
              return <Tag key={index}>{item}</Tag>;
            },
          )}
        </Space>
      ),
    },
    {
      key: '9',
      label: 'Recommend Tags',
      children: (
        <Space size={[0, 8]} wrap>
          {(postDetail?.recommendTags
            ? postDetail?.recommendTags.split(',')
            : []
          ).map((item, index) => {
            return <Tag key={index}>{item}</Tag>;
          })}
        </Space>
      ),
    },
    {
      key: '10',
      label: 'Sensitive Label',
      children: (
        <Space size={[0, 8]} wrap>
          {(postDetail?.categories ? postDetail?.categories : []).map(
            (item, index) => {
              return <Tag key={index}>{item}</Tag>;
            },
          )}
        </Space>
      ),
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
          <Statistic title="Likes" value={postDetail?.likes || 0} />
          <Statistic title="Reposts" value={postDetail?.reposts || 0} />
          <Statistic title="Visits" value={postDetail?.visits || 0} />
          <Button
            style={{ marginLeft: 80 }}
            onClick={() => {
              if (postDetail?.id) {
                Modal.confirm({
                  title: `Are you sure ${
                    postDetail?.blocked ? 'Public' : 'Block'
                  } the post？`,
                  onOk: () => {
                    const hide = message.loading('loading...', 0);
                    putContentManagePostBlocked({
                      ids: postDetail?.id + '',
                      blocked: !postDetail?.blocked,
                    })
                      .then((res) => {
                        hide();
                        if (res.code === 0) {
                          message.success(
                            'Operation successful，About to refresh',
                            1.5,
                            () => {
                              window.location?.reload();
                            },
                          );
                        } else {
                          message.error(res.msg);
                        }
                      })
                      .catch(() => {
                        message.error('error');
                      });
                  },
                });
              }
            }}
          >
            {postDetail?.blocked ? 'Public' : 'Block'}
          </Button>
          <Button
            style={{ marginLeft: -9 }}
            onClick={() => {
              if (postDetail?.id) {
                Modal.confirm({
                  title: `Are you sure delete this post?`,
                  okType: 'danger',
                  onOk: () => {
                    const hide = message.loading('loading...', 0);
                    deleteContentManagePost({
                      ids: postDetail?.id + '',
                    }).then((res) => {
                      hide();
                      if (res.code === 0) {
                        message.success(
                          'Operation successful，About to refresh',
                          1.5,
                          () => {
                            history.back();
                          },
                        );
                      } else {
                        message.error(res.msg);
                      }
                    });
                  },
                });
              }
            }}
          >
            Delete
          </Button>
          <Button style={{ marginLeft: -9 }} onClick={() => history.back()}>
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
              title={descriptionsTitle('Post Information')}
              items={postInformationItems}
              labelStyle={labelStyle as any}
              contentStyle={contentStyle}
            />
          </Col>
          <Col span={10} offset={2}>
            <Descriptions
              column={1}
              title={descriptionsTitle('Post Content')}
            />
            <Timeline
              items={
                Array.isArray(postDetail?.thread)
                  ? postDetail?.thread.map((item, index) => {
                      return {
                        children: (
                          <Descriptions column={1} key={index}>
                            <Descriptions.Item label="Title">
                              {item?.title || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Content">
                              {item?.content || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Images">
                              <Space size={[8, 16]} wrap>
                                {(item?.images || []).map(
                                  (image, imageIndex) => (
                                    <Image
                                      key={imageIndex}
                                      width={100}
                                      src={image}
                                    />
                                  ),
                                )}
                              </Space>
                            </Descriptions.Item>
                          </Descriptions>
                        ),
                      };
                    })
                  : [] // 如果 postDetail?.thread 不是数组，返回空数组
              }
            />
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
};
