import {
  deleteBotManageAssistantDigitaHumanVideoVideoId,
  getBotManageBotDigitalHumanVideoRecords,
  putBotManageAssistantDigitaHumanIdleAnimation,
  putBotManageAssistantDigitalHumanSalutation,
} from '@/services/api/shuzirenpeizhi';
import { copyToClipboard } from '@/utils';
import { ProCard } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Card, Col, Divider, message, Modal, Row, Space, Tag } from 'antd';
import moment from 'moment';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import './index.less';

export default forwardRef((props: any, ref) => {
  const { id } = props;
  // console.log({ id });

  const [eles, setEles] = useState<any[]>([]);
  const { run } = useRequest(
    () =>
      getBotManageBotDigitalHumanVideoRecords({
        profileId: id,
        pageSize: 999,
      }),
    {
      manual: true,
      onSuccess(res) {
        // console.log(res);
        if (res.code === 0) {
          const data =
            res.data?.list?.map((ele) => {
              return { ...ele, smallCard: false, span: 6 };
            }) || [];
          setEles(data);
        } else {
          message.error(res.msg || res.msg);
        }
      },
    },
  );

  useEffect(() => {
    if (id) {
      run();
    }
  }, [id, run]);

  useImperativeHandle(
    ref,
    () => ({
      run,
    }),
    [run],
  );

  const hideAll = useCallback(() => {
    setEles((eles) => {
      return eles.map((ele) => ({ ...ele, smallCard: false, span: 6 }));
    });
  }, [setEles]);

  const Cards = useMemo(() => {
    return (
      <Row gutter={[36, 34]}>
        {eles.map((ele) => {
          // console.log({ ele });

          const flagMap = {
            0: '',
            1: 'Greeting',
            2: 'Standby',
          };
          const nodeTitle = function () {
            if (ele.flag === 0) return <div style={{ height: 20 }}></div>;
            if (ele.flag === 1)
              return <Tag color="magenta">{flagMap[ele.flag]}</Tag>;
            if (ele.flag === 2)
              return <Tag color="cyan">{flagMap[ele.flag]}</Tag>;
          };
          return (
            <Col
              className="gutter-row"
              key={ele.id}
              style={{ minWidth: 400 }}
              span={12}
            >
              <Card bodyStyle={{ background: 'rgba(250,250,250,.8)' }}>
                <Space size={20}>
                  <Row gutter={[16, 24]}>
                    <Col span={8}>
                      <Card
                        // style={{ width: '80%' }}
                        cover={<video src={ele.videoUrl}></video>}
                      />
                    </Col>
                    <Col span={8}>
                      <Space align="start" size={10} direction="vertical">
                        {nodeTitle()}
                        {/* <div>Langvage:{ele.language || '-'}</div> */}
                        <div>Voice:{ele.voiceName || '-'}</div>
                        <div style={{ marginTop: 20 }}>Created At:</div>
                        <div>
                          {moment(ele.createdAt).format('YYYY-MM-DD h:mm:ss')}
                        </div>
                      </Space>
                    </Col>
                    <Col span={8}>
                      <Card style={{ width: 200 }} className="card">
                        <p
                          onClick={() => {
                            copyToClipboard(ele.videoUrl)
                              .then((res) => {
                                console.log({ res });
                                message.success('Success');
                              })
                              .catch((err) => {
                                console.log(err);
                              })
                              .finally(() => {
                                hideAll();
                              });
                          }}
                        >
                          {'Copy Link'}
                        </p>
                        <p
                          onClick={() => {
                            window.open(ele.videoUrl);
                            hideAll();
                          }}
                          style={{ marginBottom: 40, cursor: 'pointer' }}
                        >
                          {'Download'}
                        </p>

                        <p
                          onClick={() => {
                            const hide = message.info('saving....');
                            putBotManageAssistantDigitalHumanSalutation({
                              profileId: id,
                              videoId: ele?.id,
                            })
                              .then((res) => {
                                hide();
                                if (res.code === 0) {
                                  message.success('Success');
                                  run();
                                } else {
                                  message.error(res.msg);
                                }
                              })
                              .catch(() => {
                                message.error('error');
                              })
                              .finally(() => hideAll());
                          }}
                        >
                          {'Set as greeting video'}
                        </p>

                        <p
                          onClick={() => {
                            const hide = message.info('saving....');
                            putBotManageAssistantDigitaHumanIdleAnimation({
                              profileId: id,
                              // videoId: data?.greetVideoId,
                              videoId: ele?.id,
                            })
                              .then((res) => {
                                hide();
                                if (res.code === 0) {
                                  message.success('Success');
                                  run();
                                } else {
                                  message.error(res.msg);
                                }
                              })
                              .catch(() => {
                                message.error('error');
                              })
                              .finally(() => hideAll());
                          }}
                        >
                          {'Set as standby video'}
                        </p>
                        <Divider />
                        <p
                          onClick={() => {
                            Modal.confirm({
                              title: 'confirmed to delete?',
                              onOk() {
                                deleteBotManageAssistantDigitaHumanVideoVideoId(
                                  {
                                    videoId: ele.id,
                                  },
                                )
                                  .then((res) => {
                                    if (res.code === 0) {
                                      message.success('Success', 1, () => {
                                        hideAll();
                                        run();
                                      });
                                    } else {
                                      message.error(res.msg);
                                    }
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                    message.error('error');
                                  });
                              },
                            });
                          }}
                        >
                          {'Delete'}
                        </p>
                      </Card>
                    </Col>
                  </Row>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  }, [eles, hideAll, id, run]);

  return (
    <ProCard
      className="video-library"
      title="Video library"
      style={{ marginTop: 50 }}
      // onClick={() => {
      //   setEles(eles => {
      //     return eles.map(ele => ({...ele, smallCard: false}))
      //   })
      // }}
    >
      {Cards}
    </ProCard>
  );
});
