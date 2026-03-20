import { TOKEN } from '@/constants';
import { FileSizeLimit } from '@/pages/Story/utils';
import {
  deleteContentManageChapterId,
  postContentManageChapter,
  putContentManageChapter,
} from '@/services/api/contentService';
import { deepClone, getUuid, noSpaceValidator } from '@/utils';
import previewImage from '@/utils/previewImage';
import storage from '@/utils/storage';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
// import { useParams } from '@umijs/max';
import {
  Button,
  Col,
  Divider,
  Form,
  message,
  Modal,
  Row,
  Space,
  Tag,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import ChapterRules from './comps/ChapterRules';
import DividerComp from './comps/DividerComp';
import './edit.less';
import TaskIntroduction from './TaskIntroduction';

export default (props: any) => {
  const {
    setChaptersData,
    data,
    validState,
    chapterId,
    isNew,
    toReloadChapters,
    chapterOrder,
    index,
    onFormRefChange,
    storyId,
  } = props;

  // const { id } = useParams(); // storyId
  const formRef = useRef<ProFormInstance<any>>();
  const [currentChapterData, setCurrentChapter] = useState<any>(); //编辑当前chapter数据

  // 当 formRef 创建或销毁时通知父组件
  useEffect(() => {
    onFormRefChange?.(formRef);
    return () => onFormRefChange?.(null);
  }, [onFormRefChange]);

  useEffect(() => {
    if (data) {
      console.log({ data });
      setCurrentChapter({
        ...data,
      });
      formRef.current?.setFieldsValue(data);
    }
  }, [data, setCurrentChapter, formRef]);

  return (
    <ProCard
      bodyStyle={{
        background: '#f1f1f1',
        marginBottom: 30,
        border: validState ? '' : 'hightlight',
      }}
      className={currentChapterData?.fold ? 'fold' : ''}
      direction="column"
    >
      <Space
        size={20}
        align="center"
        style={{ justifyContent: 'flex-end', width: '100%' }}
      >
        <Tag color="magenta">{index + 1}</Tag>

        <Button
          type="primary"
          onClick={async () => {
            try {
              const a = await formRef.current?.validateFields();
              console.log({ a });
            } catch (err) {
              // window.scrollTo({
              //   top: 0, //formRef1.current.offsetHeight,
              //   behavior: 'smooth',
              // });
              return;
            }

            const formValues = formRef.current?.getFieldsValue();
            // return;

            const values = {
              ...formValues,
              passedPicture:
                formValues.passedPicture[0]?.response?.data ||
                formValues.passedPicture[0]?.url,
              // cover:
              //   formValues.cover[0]?.response?.data || formValues.cover[0]?.url,
              coverDark:
                formValues.coverDark[0]?.response?.data ||
                formValues.coverDark[0]?.url,
              // listCover:
              //   formValues.cover[0]?.response?.data || formValues.cover[0]?.url,
              listCoverDark:
                formValues.coverDark[0]?.response?.data ||
                formValues.coverDark[0]?.url,
              image:
                formValues.image[0].response?.data || formValues.image[0]?.url,
              // backgroundPicture:
              //   formValues.backgroundPicture[0].response?.data ||
              //   formValues.backgroundPicture[0]?.url,
              backgroundPictureDark:
                formValues.backgroundPictureDark[0].response?.data ||
                formValues.backgroundPictureDark[0]?.url,
              chapterRule: currentChapterData.chapterRule,
              chapterOrder,
            };
            console.log('values', values);
            const hide = message.info('saving....');
            // return
            const res = isNew
              ? await postContentManageChapter({
                  ...values,
                  storyId: storyId,
                  chapterOrder,
                })
              : await putContentManageChapter({
                  ...values,
                  storyId: storyId,
                  id: chapterId,
                  chapterOrder,
                });
            if (res.code === 0) {
              hide();
              message.success('Success', 2, () => {
                toReloadChapters();
              });
            } else {
              message.error(res.msg, 2, () => {});
            }
          }}
        >
          Save Chapter
        </Button>

        <div style={{ display: data?.isNew ? 'none' : 'block' }}>
          <Button
            type="primary"
            onClick={() => {
              setChaptersData((v: any) => {
                if (v) {
                  let chapters = v.map((ele: any) => {
                    if (data.id === ele.id) {
                      ele.display = true;
                    }

                    return ele;
                  });
                  return chapters;
                }
              });
            }}
          >
            Cancel
          </Button>
        </div>

        <Button
          danger
          onClick={() => {
            if (data?.isNew) {
              setChaptersData((v: any) => {
                if (v) {
                  let chapters = deepClone(v).filter(
                    (ele: any) => data.id !== ele.id,
                  );
                  return chapters;
                }
              });
              return;
            }
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

        {currentChapterData?.fold ? (
          <CaretDownOutlined
            style={{ fontSize: 17 }}
            onClick={() => {
              setChaptersData((v: any) => {
                if (v) {
                  let chapters = deepClone(v).map((ele: any) => {
                    // ele.fold = true;
                    if (ele.id === currentChapterData.id) {
                      ele.fold = !currentChapterData.fold;
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
              setChaptersData((v: any) => {
                if (v) {
                  let chapters = deepClone(v).map((ele: any) => {
                    // ele.fold = true;
                    if (ele.id === currentChapterData.id) {
                      ele.fold = !currentChapterData.fold;
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
      <ProForm
        layout="horizontal"
        formRef={formRef}
        labelCol={{
          span: 4,
        }}
        submitter={false}
        initialValues={{
          chatMinutes: 5,
        }}
        onFinish={async () => {
          const formValues = formRef.current?.getFieldsValue();
          // return;

          const values = {
            ...formValues,
            passedPicture:
              formValues.passedPicture[0]?.response?.data ||
              formValues.passedPicture[0]?.url,
            // cover:
            //   formValues.cover[0]?.response?.data || formValues.cover[0]?.url,
            coverDark:
              formValues.coverDark[0]?.response?.data ||
              formValues.coverDark[0]?.url,
            // listCover:
            //   formValues.cover[0]?.response?.data || formValues.cover[0]?.url,
            listCoverDark:
              formValues.coverDark[0]?.response?.data ||
              formValues.coverDark[0]?.url,
            image:
              formValues.image[0].response?.data || formValues.image[0]?.url,
            // backgroundPicture:
            //   formValues.backgroundPicture[0].response?.data ||
            //   formValues.backgroundPicture[0]?.url,
            backgroundPictureDark:
              formValues.backgroundPictureDark[0].response?.data ||
              formValues.backgroundPictureDark[0]?.url,
            chapterRule: currentChapterData.chapterRule,
            chapterOrder,
          };
          const hide = message.info('saving....');
          const res = isNew
            ? await postContentManageChapter({
                ...values,
                storyId: storyId,
                chapterOrder,
              })
            : await putContentManageChapter({
                ...values,
                storyId: storyId,
                id: chapterId,
                chapterOrder,
              });
          if (res.code === 0) {
            hide();
            message.success('Success', 2, () => {
              toReloadChapters();
            });
          } else {
            message.error(res.msg, 2, () => {});
          }

          return true;
        }}
      >
        <Row>
          <Col span={24}>
            <ProFormText
              allowClear
              width="md"
              name={'chapterName'}
              placeholder="Please enter"
              label="Chapter name"
              labelCol={{
                span: 5,
              }}
              rules={[
                { required: true, message: 'Please enter' },
                {
                  validator: noSpaceValidator,
                },
              ]}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <ProFormDigit
              allowClear
              width="md"
              name={'chapterScore'}
              placeholder="Chapter passing scores with story degrees"
              label="Passing scores"
              labelCol={{
                span: 5,
              }}
              rules={[
                {
                  required: true,
                  message: 'Chapter passing scores with story degrees',
                },
              ]}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <ProFormDigit
              allowClear
              width="md"
              name="chatMinutes"
              label="Necessary Duration"
              min={1}
              placeholder="Please enter"
              labelCol={{
                span: 5,
              }}
              addonAfter={<>min</>}
              // rules={[{ required: true, message: 'Please enter' }]}
              // extra={<h5 style={{ marginBottom: 20 }}>Attach importance</h5>}
            />
          </Col>
        </Row>

        <Form.Item
          label="Cover"
          labelCol={{
            span: 5,
          }}
          required
        >
          <Row>
            {/* <Col span={6}>
              <ProFormUploadButton
                name="cover"
                label="Light mode"
                action={APP_API_HOST + '/user/public/file-upload'}
                max={1}
                title={'Upload'}
                required={false}
                fieldProps={{
                  name: 'file',
                  listType: 'picture-card',
                  accept: 'image/*',
                  headers: {
                    Authorization: `${storage.get(TOKEN)}`,
                  },
                  beforeUpload: (file) => {
                    return FileSizeLimit(file);
                  },
                  onPreview(file) {
                    // window.open(file.url);
                    previewImage({ url: file.url || '' });
                  },
                }}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please upload image!' }]}
                transform={(val) => ({
                  cover: val[0]?.response?.data || data?.cover,
                })}
              />
            </Col> */}
            <Col span={6}>
              <ProFormUploadButton
                name="coverDark"
                label="Dark mode"
                action={APP_API_HOST + '/user/public/file-upload'}
                max={1}
                required={false}
                title={'Upload'}
                fieldProps={{
                  name: 'file',
                  listType: 'picture-card',
                  accept: 'image/*',
                  headers: {
                    Authorization: `${storage.get(TOKEN)}`,
                  },
                  beforeUpload: (file) => {
                    return FileSizeLimit(file);
                  },
                  onPreview(file) {
                    // window.open(file.url);
                    previewImage({ url: file.url || '' });
                  },
                }}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please upload image!' }]}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label="Background Picture"
          labelCol={{
            span: 5,
          }}
          required
        >
          <Row>
            {/* <Col span={6}>
              <ProFormUploadButton
                name="backgroundPicture"
                label="Light mode"
                action={APP_API_HOST + '/user/public/file-upload'}
                max={1}
                title={'Upload'}
                required={false}
                fieldProps={{
                  name: 'file',
                  listType: 'picture-card',
                  accept: 'image/*',
                  headers: {
                    Authorization: `${storage.get(TOKEN)}`,
                  },
                  beforeUpload: (file) => {
                    return FileSizeLimit(file);
                  },
                  onPreview(file) {
                    window.open(file.url);
                  },
                }}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please upload image!' }]}
                transform={(val) => ({
                  image: val[0]?.response?.data || data?.image,
                })}
              />
            </Col> */}
            <Col span={6}>
              <ProFormUploadButton
                required={false}
                name="backgroundPictureDark"
                label="Dark mode"
                action={APP_API_HOST + '/user/public/file-upload'}
                max={1}
                title={'Upload'}
                fieldProps={{
                  name: 'file',
                  listType: 'picture-card',
                  accept: 'image/*',
                  headers: {
                    Authorization: `${storage.get(TOKEN)}`,
                  },
                  beforeUpload: (file) => {
                    return FileSizeLimit(file);
                  },
                  onPreview(file) {
                    // window.open(file.url);
                    previewImage({ url: file.url || '' });
                  },
                }}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please upload image!' }]}
              />
            </Col>
          </Row>
        </Form.Item>

        <ProFormUploadButton
          name="image"
          label="Image"
          action={APP_API_HOST + '/user/public/file-upload'}
          max={1}
          title={'Upload'}
          style={{ objectFit: 'none' }} // 没生效
          className="picture-circle"
          fieldProps={{
            name: 'file',
            listType: 'picture-circle',
            accept: 'image/*',
            headers: {
              Authorization: `${storage.get(TOKEN)}`,
            },
            beforeUpload: (file) => {
              return FileSizeLimit(file);
            },
            onPreview(file) {
              window.open(file.url);
            },
          }}
          labelCol={{
            span: 5,
          }}
          rules={[{ required: true, message: 'Please upload image!' }]}
          transform={(val) => ({
            image: val[0]?.response?.data || data?.image,
          })}
        />

        <ProFormTextArea
          allowClear
          width="xl"
          name={'summary'}
          placeholder="Please enter"
          label="Summary"
          labelCol={{
            span: 5,
          }}
          fieldProps={{
            rows: 3,
          }}
          rules={[
            { required: true, message: 'Please enter' },
            {
              validator: noSpaceValidator,
            },
          ]}
        />

        <ProForm.Item
          name="taskIntroduction"
          label="Chapter Introduction"
          labelCol={{
            span: 5,
          }}
          rules={[
            { required: true, message: 'Please enter here' },
            {
              validator: noSpaceValidator,
            },
            {
              validator: (rule, value) => {
                const delimiterRegex = /[.,\s]+/;
                if (value.split(delimiterRegex).length > 500) {
                  return Promise.reject(new Error('Not more than 500 words.'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <TaskIntroduction />
        </ProForm.Item>

        <DividerComp
          subTitle="Chapter passed setting"
          desc="The pictures and text displayed when the sotry passed"
        />

        <ProFormUploadButton
          name="passedPicture"
          label="Passed picture"
          action={APP_API_HOST + '/user/public/file-upload'}
          max={1}
          title={'Upload'}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            accept: 'image/*',
            headers: {
              Authorization: `${storage.get(TOKEN)}`,
            },
            beforeUpload: (file) => {
              return FileSizeLimit(file);
            },
            onPreview(file) {
              // window.open(file.url);
              previewImage({ url: file.url || '' });
            },
          }}
          labelCol={{
            span: 5,
          }}
          rules={[{ required: true, message: 'Please upload image!' }]}
          transform={(val) => ({
            passedPicture: val[0]?.response?.data || data?.passedPicture,
          })}
        />

        <ProFormTextArea
          allowClear
          width="lg"
          name="passedCopywriting"
          label="Passed copywriting"
          labelCol={{
            span: 6,
          }}
          rules={[
            { required: true, message: 'Please enter' },
            {
              validator: noSpaceValidator,
            },
          ]}
        />

        <DividerComp
          subTitle="Chapter prompts"
          desc="The chapter's prompt setting"
        />

        <ProFormTextArea
          allowClear
          width="xl"
          name={'backgroundPrompt'}
          placeholder="Please enter"
          label="Background"
          labelCol={{
            span: 5,
          }}
          fieldProps={{
            rows: 3,
          }}
          rules={[
            { required: true, message: 'Please enter' },
            {
              validator: noSpaceValidator,
            },
          ]}
        />

        <ProFormTextArea
          allowClear
          width="xl"
          name={'personality'}
          placeholder="Please enter"
          label="Personality"
          labelCol={{
            span: 5,
          }}
          fieldProps={{
            rows: 3,
          }}
          rules={[
            { required: true, message: 'Please enter' },
            {
              validator: noSpaceValidator,
            },
          ]}
        />

        <ProFormTextArea
          allowClear
          width="xl"
          name="tonePrompt"
          label="Tone"
          placeholder="Please enter"
          labelCol={{
            span: 5,
          }}
          fieldProps={{
            rows: 3,
          }}
          rules={[
            { required: true, message: 'Please enter' },
            {
              validator: noSpaceValidator,
            },
          ]}
        />

        <ProFormRadio.Group
          name="wordNumberPrompt"
          label="Word number"
          labelCol={{
            span: 5,
          }}
          options={[
            {
              label: 'short',
              value: 'short',
            },
            {
              label: 'normal',
              value: 'normal',
            },
            {
              label: 'detail',
              value: 'detail',
            },
          ]}
          rules={[{ required: true, message: 'Please  eneter' }]}
          fieldProps={{
            style: { marginBottom: 0 },
          }}
          extra={
            <h5 style={{ marginBottom: 20 }}>
              {
                'short short answer (within 20 words) normal (20-50 words) detailed answer (50-100)'
              }
            </h5>
          }
        />
      </ProForm>

      <ProCard
        title="Chapter rules"
        ghost
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            danger
            onClick={() => {
              setCurrentChapter((v: any[]) => {
                let chapter = deepClone(v);
                // chapter.chapterGifts.push({ id: getUuid() });
                chapter.chapterRule.push({
                  key: getUuid(),
                  rule: {
                    recommendAnswer: '', // 一定要初始化，否则会传null到后端，然后复显编辑都出问题
                    question: '',
                    weight: 0,
                    friendDegree: 0,
                    storyDegree: 0,
                  },
                });
                return chapter;
              });
            }}
          >
            Add rule
          </Button>
        }
      >
        <Divider style={{ background: '#444' }} />
        <ChapterRules
          rules={currentChapterData?.chapterRule || []}
          setCurrentChapter={setCurrentChapter}
          chapterOrder={chapterOrder}
          formRef={formRef}
        />
      </ProCard>
    </ProCard>
  );
};
