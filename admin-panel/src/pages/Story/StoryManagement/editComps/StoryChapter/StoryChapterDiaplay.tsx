import { deepClone } from '@/utils';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
// import { history } from '@umijs/max';
import CreateOrEditChapterGift from '@/pages/Story/StoryManagement/editComps/StoryChapter/comps/ChapterGifts/CreateOrEditChapterGift';
import { deleteContentManageChapterId } from '@/services/api/contentService';
// import { useParams } from '@umijs/max';
import {
  Button,
  Col,
  Divider,
  Image,
  message,
  Modal,
  Row,
  Space,
  Tag,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import ChapterGifts from './comps/ChapterGifts';
import DividerComp from './comps/DividerComp';

export default (props: any) => {
  // const { id = '' } = useParams();
  const {
    setChaptersData,
    data,
    validState,
    chapterId,
    toReloadChapters,
    index,
    storyId,
  } = props;
  const [chapterData, setChapterData] = useState<any>();

  useEffect(() => {
    if (data) {
      setChapterData({
        ...data,
      });
    }
  }, [data]);

  const labelWrapNode = useCallback((v: string, width = 90) => {
    // label使用标签，会导致控制台报提示,加key或id不管用, 但在线上不会报
    return (
      <div
        style={{
          width,
          // textAlign: 'justify',
          // textAlignLast: 'justify'
          // background:'#f1f1f1',
          textAlign: 'right',
        }}
      >
        {v}
      </div>
    );
  }, []);

  const basicColumns = [
    {
      label: labelWrapNode('Chapter name', 150),
      dataIndex: 'chapterName',
      span: 2,
      labelStyle: { width: 150, textAlign: 'right' },
    },
    {
      label: labelWrapNode('Passing score', 130),
      dataIndex: 'chapterScore',
      span: 2,
      labelStyle: { width: 150 },
    },
    {
      label: labelWrapNode('Necessary Duration', 130),
      dataIndex: 'chatMinutes',
      span: 2,
      labelStyle: { width: 150 },
      render(Duration: any) {
        return <>{`${Duration} min`}</>;
      },
    },
    {
      label: labelWrapNode('Cover', 130),
      dataIndex: 'coverDisplay',
      span: 2,
      labelStyle: { width: 150 },
      render(cover: any, record: any) {
        // console.log('record', record);
        return (
          <Row gutter={12}>
            <Col span={12}>
              <Image width={100} height={100} src={cover} />
            </Col>
            <Col span={12}>
              <Image width={100} height={100} src={record?.coverDarkDisplay} />
            </Col>
          </Row>
        );
      },
    },
    {
      label: labelWrapNode('Image', 130),
      dataIndex: 'imageDisplay',
      span: 2,
      labelStyle: { width: 150 },
      render(image: any) {
        return <Image width={100} height={100} src={image} />;
      },
    },
    {
      label: labelWrapNode('Summary', 130),
      dataIndex: 'summary',
      span: 2,
      labelStyle: { width: 150 },
    },
  ];

  const settingColumns = [
    {
      label: labelWrapNode('Passed picture', 130),
      dataIndex: 'passedPictureDisPlay',
      span: 2,
      labelStyle: { width: 150 },
      render(image: any) {
        return <Image width={100} height={100} src={image} />;
      },
    },
    {
      label: labelWrapNode('Passed copywriting', 130),
      dataIndex: 'passedCopywriting',
      span: 2,
      labelStyle: { width: 150 },
    },
  ];
  const promptColumns = [
    {
      label: labelWrapNode('Background', 130),
      dataIndex: 'backgroundPrompt',
      span: 2,
      labelStyle: { width: 150 },
    },
    {
      label: labelWrapNode('Personality', 130),
      dataIndex: 'personality',
      span: 2,
      labelStyle: { width: 150 },
    },
    {
      label: labelWrapNode('Tone', 130),
      dataIndex: 'tonePrompt',
      span: 2,
      labelStyle: { width: 150 },
    },
    {
      label: labelWrapNode('Words number', 130),
      dataIndex: 'wordNumberPrompt',
      span: 2,
      labelStyle: { width: 150 },
    },
  ];
  const ruleColumns = [
    {
      label: labelWrapNode('Question', 180),
      dataIndex: 'question',
      span: 2,
      // labelStyle: { width: 150 },
    },
    {
      label: labelWrapNode('Recommended answer', 180),
      dataIndex: 'recommendAnswer',
      span: 2,
      // labelStyle: { width: 180 },
    },
    {
      label: labelWrapNode('Friend degree', 180),
      dataIndex: 'friendDegree',
      span: 2,
      // labelStyle: { width: 130 },
      render(_, ele: any) {
        return (
          <Space>
            <span>Friend degree：{ele.friendDegree}</span>
            <Divider type="vertical" style={{ background: '#777' }}></Divider>
            <span>Story degree：{ele.storyDegree}</span>
            <Divider type="vertical" style={{ background: '#777' }}></Divider>
            <span>Weight: {ele.weight}</span>
          </Space>
        );
      },
    },
  ];

  return (
    <ProCard
      bodyStyle={{
        background: '#f1f1f1',
        marginBottom: 30,
        border: validState ? '' : 'hightlight',
      }}
      direction="column"
      className={chapterData?.fold ? 'fold' : ''}
    >
      <Space
        size={20}
        align="center"
        style={{ justifyContent: 'flex-end', width: '100%' }}
      >
        <div style={{ display: 'none' }}>
          <Button type="primary">Test Chapter</Button>
        </div>

        <Tag color="magenta">{index + 1}</Tag>

        <Button
          onClick={() => {
            setChaptersData((v: any) => {
              if (v) {
                let chapters = deepClone(v).map((ele: any) => {
                  // ele.display = true; //display: true ---> 展示 ; false --->编辑
                  if (data.id === ele.id) {
                    ele.display = false;
                    ele.fold = false;
                  }
                  return ele;
                });
                return chapters;
              }
            });
          }}
        >
          Edit chapter
        </Button>
        <Button
          danger
          onClick={() => {
            Modal.confirm({
              title: 'confimed to delete?',
              onOk() {
                deleteContentManageChapterId({
                  id: chapterId,
                }).then((res) => {
                  if (res.code === 0) {
                    message.success('Success');
                    toReloadChapters();
                  } else {
                    message.error(res.msg);
                  }
                });
              },
            });
          }}
        >
          Delete Chapter
        </Button>

        {chapterData?.fold ? (
          <CaretDownOutlined
            style={{ fontSize: 17 }}
            onClick={() => {
              // setDisplay(!display)
              setChaptersData((v: any) => {
                if (v) {
                  let chapters = deepClone(v).map((ele: any) => {
                    // ele.fold = true;
                    if (ele.id === chapterData.id) {
                      ele.fold = !chapterData.fold;
                    }
                    return ele;
                  });
                  return chapters;
                }
              });
            }}
          />
        ) : (
          <CaretUpOutlined
            style={{ fontSize: 17 }}
            onClick={() => {
              // setDisplay(!display)
              setChaptersData((v: any) => {
                if (v) {
                  let chapters = deepClone(v).map((ele: any) => {
                    // ele.fold = true;
                    if (ele.id === chapterData.id) {
                      ele.fold = !chapterData.fold;
                    }
                    return ele;
                  });
                  return chapters;
                }
              });
            }}
          />
        )}
      </Space>

      <DividerComp
        subTitle="Chapter basics"
        desc="The chapter's basic setting"
      />

      <ProDescriptions column={1} dataSource={data} columns={basicColumns} />

      <DividerComp
        subTitle="Chapter passed setting"
        desc="The pictures and text displayed when the sotry passed"
      />
      <ProDescriptions column={1} dataSource={data} columns={settingColumns} />

      <DividerComp
        subTitle="Chapter prompts"
        desc="The chapter's prompt setting"
      />

      <ProDescriptions column={1} dataSource={data} columns={promptColumns} />

      <DividerComp subTitle="Chapter rules" desc="" />
      <Space direction="vertical">
        {chapterData?.chapterRule?.map((ele: any, index: number) => (
          <ProDescriptions
            style={{ background: '#fff' }}
            column={1}
            key={index}
            dataSource={ele.rule}
            columns={ruleColumns}
          />
        ))}
      </Space>

      <ProCard
        title="Chapter gifts"
        style={{ background: 'transparent', marginTop: 30 }}
        extra={
          <CreateOrEditChapterGift
            title={' '}
            trigger={
              <Button type="primary" icon={<PlusOutlined />} danger>
                Add chapter gift
              </Button>
            }
            storyId={storyId}
            giftId={'new'}
            chapterId={chapterId}
            callback={toReloadChapters}
          />
        }
      >
        <Divider style={{ background: '#444' }} />
        <ChapterGifts
          data={chapterData?.chapterGifts}
          toReloadChapters={toReloadChapters}
        />
      </ProCard>
    </ProCard>
  );
};
