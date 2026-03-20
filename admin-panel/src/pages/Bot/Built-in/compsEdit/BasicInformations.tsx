import { TOKEN } from '@/constants';
import CustomUpload from '@/pages/SystemManagement/AssistantSetting/compsEdit/CustomUpload';
import { getBotManageDic } from '@/services/api/botService';
import {
  getBotManageCategory,
  getBotManageCategoryId,
} from '@/services/api/leixinglanmuguanli';
import { getUuid, noSpaceValidator } from '@/utils';
import previewImage from '@/utils/previewImage';
import storage from '@/utils/storage';
import { validateFileUpload } from '@/utils/upload';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormDependency,
  ProFormRadio,
  ProFormSelect,
  ProFormSlider,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Checkbox, Col, Divider, Form, Input, Row, Switch } from 'antd';
import { useEffect, useState } from 'react';
import BotProfession from './botProfession';
import PostingFrequecy from './PostingFrequecy';
import './style.less';
// import Tags from './Tags';
const { TextArea } = Input;

export default (props: any) => {
  const { formRef, data } = props;
  // console.log({ data });

  const [isConversationStyleEdited, setConversationStyleEdited] =
    useState<boolean>(false);

  const [DialogueTemplates, setTemplates] = useState<any[]>([]);

  const [categoryId, setCategoryId] = useState('');
  const [tagsList, setTags] = useState([]);

  const { runAsync } = useRequest(getBotManageCategoryId, {
    manual: true,
    onSuccess(res) {
      if (res.code === 0) {
        setTags(res.data?.tags || []);
      }
    },
  });

  const stylesOptions = [
    {
      label: 'Expert-style writing prompt',
      value:
        "Focus on explaining profound concepts in simple terms, adopt a narrative expression form, and ensure that the content is logically rigorous and well-organized. When elaborating on viewpoints or explaining knowledge, start from the audience's level of understanding, transform complex concepts or information into easy-to-understand content, and unfold them step by step like telling a story, so that readers can easily follow the train of thought, while reflecting the depth and authority in the professional field.",
    },
    {
      label: 'Experience-style writing prompt',
      value:
        'The content should be like a practical manual, focusing on providing executable operation steps. Transform relevant experiences into specific and clear action guidelines with clear and orderly steps, so that readers can complete the corresponding operations step by step according to the prompts. The language should be concise and clear, avoiding vague or overly abstract expressions, focusing on practicality and operability, so that readers can directly learn from and apply it.',
    },
    {
      label: 'Romantic-style writing prompt',
      value:
        "Draw on the creative style of Chinese prose to create a poetic atmosphere. Use beautiful and vivid words, pay attention to the expression of emotions and the creation of artistic conception, and arouse readers' association and resonance through delicate descriptions. Elements such as natural scenes and life details can be integrated to make the text have a sense of picture and appeal, with a free and flexible style, not restricted by too many rules and regulations, conveying a romantic and lyrical atmosphere.",
    },
    {
      label: 'Technical-style writing prompt',
      value:
        'Conduct detailed and professional explanations and elaborations on specific topics or characteristics. Use very professional terms and expressions, conduct in-depth analysis of relevant technical details, principles or characteristics, with detailed and accurate content, and strong professionalism and knowledge. Ensure the rigor of the information, so that readers can acquire rich professional knowledge after reading and have a comprehensive and in-depth understanding of the explained content.',
    },
    {
      label: 'Solution-style writing prompt',
      value:
        'Put forward solutions around specific problems and carry out in the form of question and answer. First, clearly point out the problem to be solved, then give specific and feasible solutions to the problem, and explain the content, implementation steps, precautions, etc. of the solution in the process of question and answer. The question and answer should have close logic, and the solution should be targeted and operable, so that readers can clearly understand how to use the solution to solve the corresponding problem.',
    },
  ];

  useEffect(() => {
    if (data?.categoryId) {
      runAsync({ id: data.categoryId }).then((res) => {
        if (res.code === 0) {
          setTimeout(() => {
            console.log(res.data.tags);
            // formRef.current.setFieldValue('tags', res.data.tags);
          }, 300);
        }
      });
      setCategoryId(data.categoryId);
    }
  }, [data, formRef, runAsync]);

  useEffect(() => {
    if (data?.dialogueTemplates) {
      console.log(data?.dialogueTemplates);
      setTemplates(
        data.dialogueTemplates.map((ele) => ({ id: getUuid(), value: ele })),
      );
    }
  }, [data?.dialogueTemplates]);

  return (
    <ProCard>
      <ProForm
        layout="horizontal"
        formRef={formRef}
        submitter={false}
        labelCol={{
          span: 5,
        }}
        initialValues={{
          visibled: true, //默认传true  必传
          salutationFrequency: 10,
          salutationPrompts: 'test',
          dialogueTemplates: [],
          postingEnable: true,
        }}
      >
        <h2 style={{ color: 'blue' }}>Basic Infomation</h2>
        <Divider style={{ marginTop: 0 }} />

        <div style={{ display: 'none' }}>
          <ProFormText name="visibled" />
          <ProFormText name="dialogueTemplates" />
        </div>
        <ProFormText
          width="xl"
          name="botName"
          label="Name"
          placeholder={
            'The name must be unique and use 4-20 categorys, including letters, num...'
          }
          rules={[
            {
              required: true,
              message: 'Please enter',
            },
            {
              validator: noSpaceValidator,
            },
            // ({}) => ({
            //   //getFieldValue
            //   validator(_, value) {
            //     const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,20}$/;
            //     if (regex.test(value)) {
            //       return Promise.resolve();
            //     }
            //     return Promise.reject(
            //       new Error(
            //         'The name must be unique and use 4-20 categorys, including letters, num...',
            //       ),
            //     );
            //   },
            // }),
          ]}
        />

        <ProFormRadio.Group
          name="gender"
          label="gender"
          options={[
            {
              label: 'male',
              value: 'MALE',
            },
            {
              label: 'female',
              value: 'FEMALE',
            },
          ]}
          rules={[{ required: true, message: 'Please  eneter' }]}
        />

        <ProForm.Item
          name="avatar"
          label="Avatar"
          labelCol={{
            span: 5,
          }}
          rules={[{ required: true, message: 'Plese select!' }]}
        >
          <CustomUpload />
        </ProForm.Item>

        {/* <ProFormUploadButton
          name="avatar"
          label="Avatar"
          action={APP_API_HOST + '/user/public/file-upload'}
          max={1}
          title={'Upload'}
          fieldProps={{
            name: 'file',
            listType: 'picture-circle',
            accept: 'image/*',
            headers: {
              Authorization: `${storage.get(TOKEN)}`,
            },
            onPreview(file) {
              // window.open(file.url);
              previewImage({ url: file.url || '' });
            },
            beforeUpload: validateFileUpload(),
            showUploadList: {
              showPreviewIcon: true,
              showRemoveIcon: true,
            },
            // iconRender: () => <UserOutlined style={{ fontSize: 28, color: '#999' }} />,
            // // 自定义上传按钮的样式
            children: <UserOutlined style={{ fontSize: 28, color: '#999' }} />
            
          }}
          labelCol={{
            span: 5,
          }}
         
          transform={(val) => {
            const arr = val[0]?.url
              ? val
              : val.map((ele: any) => ({
                  url: ele.response?.data,
                  id: ele.id,
                }));

            return {
              album: arr,
            };
          }}
        /> */}

        {/* <ProFormUploadButton
          name="avatar"
          label="Avatar"
          action={APP_API_HOST + '/user/public/file-upload'}
          max={1}
          title={'Upload'}
          fieldProps={{
            name: 'file',
            listType: 'picture-circle',
            accept: 'image/*',
            headers: {
              Authorization: `${storage.get(TOKEN)}`,
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
            avatar: val[0]?.response?.data || data?.avatar,
          })}
        /> */}

        <ProFormUploadButton
          name="album"
          label="Album"
          action={APP_API_HOST + '/user/public/file-upload'}
          max={5}
          title={'Upload'}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            accept: 'image/*',
            headers: {
              Authorization: `${storage.get(TOKEN)}`,
            },
            onPreview(file) {
              // window.open(file.url);
              previewImage({ url: file.url || '' });
            },
            beforeUpload: validateFileUpload(),
          }}
          labelCol={{
            span: 5,
          }}
          transform={(val) => {
            const arr = val[0]?.url
              ? val
              : val.map((ele: any) => ({
                  url: ele.response?.data,
                  id: ele.id,
                }));

            return {
              album: arr,
            };
          }}
        />

        <ProFormTextArea
          width="lg"
          name={'botIntroduce'}
          placeholder="Please enter"
          label="Introduce"
          rules={[
            {
              required: true,
              message: 'Please  eneter',
            },
            {
              validator: noSpaceValidator,
              // message: 'Please enter valid content. It cannot be all spaces.',
            },
            ({}) => ({
              validator(_, value) {
                const delimiterRegex = /[.,\s]+/;
                if (value.split(delimiterRegex).length < 300) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    'Please enter the bot’s introduction in 300 words.',
                  ),
                );
              },
            }),
          ]}
          transform={(val) => {
            return {
              botIntroduce: val.trim(),
            };
          }}
        />

        <ProFormSelect
          width="md"
          fieldProps={{
            labelInValue: true,
          }}
          request={async () => {
            const { data } = await getBotManageCategory({
              pageNo: 1,
              pageSize: 999,
            });
            const _list = data.list.map((ele) => {
              return {
                label: ele.categoryName,
                value: ele.categoryId,
              };
            });
            return _list;
          }}
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: 'Please  eneter' }]}
          onChange={(v: any) => {
            console.log(v);
            if (v?.label) {
              formRef.current.setFieldValue('categoryName', v?.label);
              setCategoryId(v.value);
              runAsync({ id: v.value });
            } else {
              setCategoryId(null);
            }
          }}
        />
        {categoryId && tagsList.length > 0 && (
          <ProFormCheckbox.Group
            name="tags"
            label="Choice tags"
            options={[...tagsList]}
            // rules={[{ required: true, message: 'Please  eneter' }]}
          />
        )}

        {/* <ProFormDigit
          width="sm"
          name={'postingFrequecy'}
          placeholder="Please enter"
          label="Posting frequency"
          rules={[{ required: true, message: 'Please enter' }]}
        /> */}

        <h2 style={{ color: 'blue', marginTop: 50 }}>Posting Setting</h2>
        <Divider style={{ marginTop: 0 }} />
        <ProFormTextArea
          width="lg"
          name={'postingPrompt'}
          placeholder="Nice to meet you!"
          label="Posting Promot"
          fieldProps={{
            rows: 4,
          }}
          rules={[
            { required: true, message: 'Please  eneter' },
            {
              validator: noSpaceValidator,
            },
          ]}
        />
        <ProFormSelect
          name="postingStyle"
          label="Style"
          width="md"
          rules={[{ required: true, message: 'Please select' }]}
          options={stylesOptions}
        />
        <Form.Item
          name="postingEnable"
          label="Auto-posting"
          labelCol={{
            span: 5,
          }}
          valuePropName="checked" // 关键属性
        >
          <Switch
            checkedChildren="open"
            unCheckedChildren="close"
            // defaultChecked
          />
        </Form.Item>
        <Form.Item
          name="postingFrequecy"
          label="Posting frequency"
          rules={[{ required: true, message: 'Please select' }]}
          labelCol={{
            span: 5,
          }}
        >
          <PostingFrequecy
            // value={value}
            // onChange={onChange}
            formRef={formRef}
          />
        </Form.Item>

        {/* <ProForm.Item
          name="tags"
          label="Tags"
          labelCol={{
            span: 5,
          }}
        >
          <Tags />
        </ProForm.Item> */}

        <h2 style={{ color: 'blue', marginTop: 50 }}>Bot Prompt</h2>
        <Divider style={{ marginTop: 0 }} />
        <Row>
          <Col span={12}>
            <ProFormDependency name={['age']}>
              {({ age }) => {
                return (
                  <ProFormSlider
                    name="age"
                    label="Age(Optional)"
                    width="sm"
                    fieldProps={{
                      tooltip: { open: false },
                    }}
                    colProps={{
                      span: 24,
                    }}
                    labelCol={{
                      span: 12,
                    }}
                    marks={
                      age
                        ? {
                            0: '0',
                            [age]: `${age}`,
                            100: 'without',
                          }
                        : {
                            0: '0',
                            100: 'without',
                          }
                    }
                    rules={[{ required: true, message: 'Please set' }]}
                  />
                );
              }}
            </ProFormDependency>
          </Col>
        </Row>

        <Form.Item
          className="wk"
          style={{ marginBottom: 40 }}
          name="profession"
          label="Role's Profession"
          rules={[{ required: true, message: 'Plese select!' }]}
        >
          <BotProfession />
        </Form.Item>

        <ProFormTextArea
          width="xl"
          name={'botCharacter'}
          placeholder="Please enter"
          label="Characters"
          rules={[
            { required: true, message: 'Please enter' },
            {
              validator: noSpaceValidator,
            },
          ]}
          labelCol={{
            span: 5,
          }}
        />

        <ProFormTextArea
          width="xl"
          name={'personalStrength'}
          placeholder="Please enter"
          label="Personal strength"
          fieldProps={{
            rows: 4,
          }}
          rules={[
            { required: true, message: 'Please enter' },
            {
              validator: noSpaceValidator,
            },
          ]}
        />

        <h2 style={{ color: 'blue', marginTop: 50 }}>Answer Stratogy</h2>
        <Divider style={{ marginTop: 0 }} />
        <ProFormSelect
          name="conversationStyle"
          label="Conversation style"
          width="xl"
          request={async () => {
            const res = await getBotManageDic({
              dicType: 'botConversationStyle',
            });
            return (
              res.data.map((ele) => {
                return {
                  label: ele.dicValue,
                  value: ele.dicValue,
                };
              }) || []
            );
          }}
          rules={[
            { required: true, message: 'Please enter' },
            {
              validator: noSpaceValidator,
            },
          ]}
        />

        <ProFormSelect
          mode="multiple"
          name="rules"
          label="Rules"
          width="xl"
          fieldProps={{
            labelInValue: true,
          }}
          request={async () => {
            const res = await getBotManageDic({ dicType: 'botRules' });
            return (
              res.data.map((ele) => {
                return {
                  label: ele.dicValue,
                  value: ele.dicValue,
                };
              }) || []
            );
          }}
          rules={[{ required: true, message: 'Please enter' }]}
          onChange={() => {
            setConversationStyleEdited(true);
          }}
        />

        <h2
          style={{
            color: 'blue',
            marginTop: 70,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>Dialogue Templates</div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            danger
            onClick={() => {
              setTemplates((v) => [
                ...v,
                {
                  id: getUuid(),
                  value: '',
                },
              ]);
            }}
          >
            Add
          </Button>
        </h2>
        <Divider style={{ marginTop: 0 }} />
        <div style={{ marginBottom: 20 }}>
          {
            'Users can send these templates to the chatbot in the app. It can help users quickly grasp the chatting style with the bot. '
          }
          <br />
          {'（* Suggest each template to be no more than 12 words.）'}
        </div>

        {DialogueTemplates?.map((ele) => {
          return (
            <Row style={{ marginBottom: 20 }} key={ele.id}>
              <Col span={18}>
                <TextArea
                  value={ele?.value}
                  status={ele.isError ? 'error' : ''}
                  onChange={(e) => {
                    let isError = false;
                    const delimiterRegex = /[.,\s]+/;
                    if (e.target.value.split(delimiterRegex).length > 12) {
                      isError = true;
                    } else {
                      isError = false;
                    }
                    const temps = DialogueTemplates.map((item) => {
                      if (item.id === ele.id) {
                        if (!isError) {
                          item.value = e.target.value;
                        }
                        item.isError = isError;
                      }
                      return item;
                    });
                    setTemplates(temps);
                    formRef?.current?.setFieldValue('dialogueTemplates', temps);
                  }}
                  placeholder="Enter like this：Please compose a poem for me."
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  allowClear
                />
                {ele.isError && (
                  <div style={{ color: 'red' }}>
                    {'Not more than 12 words.'}
                  </div>
                )}
              </Col>
              <Col span={6}>
                <DeleteOutlined
                  style={{
                    fontSize: 22,
                    color: 'red',
                    marginLeft: 30,
                  }}
                  onClick={() => {
                    const temps = DialogueTemplates.filter((template) => {
                      return template.id !== ele.id;
                    });
                    setTemplates(temps);
                    formRef?.current?.setFieldValue('dialogueTemplates', temps);
                  }}
                />
              </Col>
            </Row>
          );
        })}

        <h2 style={{ color: 'blue', marginTop: 50 }}>Add-on</h2>
        <Divider style={{ marginTop: 0 }} />

        <div style={{ display: 'none' }}>
          <Row>
            <Col span={12}>
              <ProFormDependency name={['salutationFrequency']}>
                {({ salutationFrequency }) => {
                  return (
                    <ProFormSlider
                      name="salutationFrequency"
                      label="Salution frenquency"
                      width="sm"
                      fieldProps={{
                        tooltip: { open: false },
                      }}
                      colProps={{
                        span: 24,
                      }}
                      labelCol={{
                        span: 12,
                      }}
                      marks={
                        salutationFrequency
                          ? {
                              0: '0',
                              [salutationFrequency]: `${salutationFrequency}`,
                              100: 'without',
                            }
                          : {
                              0: '0',
                              100: 'without',
                            }
                      }
                      rules={[{ required: true, message: 'Please set' }]}
                    />
                  );
                }}
              </ProFormDependency>
            </Col>
          </Row>

          <ProFormTextArea
            width="xl"
            name={'salutationPrompts'}
            placeholder="Please enter"
            label="Salution prompts"
            rules={[
              { required: true, message: 'Please enter' },
              // {
              //   validator: noSpaceValidator,
              // },
            ]}
          />
        </div>

        <ProFormDependency
          name={[
            'botName',
            'gender',
            'age',
            'personalStrength',
            'profession',
            'botCharacter',
            'conversationStyle',
            'rules',
          ]}
        >
          {({
            botName: name,
            gender,
            age,
            personalStrength,
            profession: role,
            botCharacter: Character,
            conversationStyle,
            rules,
          }) => {
            // console.log(rules);

            let _rules =
              rules?.map((ele, index) => `${index + 1}. ` + ele).join('  ') ||
              '';
            if (isConversationStyleEdited) {
              _rules = rules
                .map((ele, index) => `${index + 1}. ` + ele.value)
                .join('  ');
            }

            let a = `Your name is ${name}, ${gender}, ${age}. `;
            let b = `you are ${personalStrength} `;
            let c = `And you job is a ${role}, your experience covers ${Character}. `;
            let d = `You always maintain ${conversationStyle}  when chatting with people. `;
            let e = `It is important to emphasize that when communicating with me. You must keep the following rules: ${_rules}`;

            // Your name is {name},{gender},{age}.
            // you are {personal strength }.
            // And you job is a {role}, your experience covers {Character}.
            // You always maintain {conversation style}  when chatting with people.
            // It is important to emphasize that when communicating with me, you need to provide {rules} .

            let prompts = a + b + c + d + e;

            formRef?.current?.setFieldValue('prompts', prompts);

            return (
              <ProForm.Item
                name="prompts"
                label="Prompts preview"
                labelCol={{
                  span: 5,
                }}
              >
                <h4>{prompts}</h4>
              </ProForm.Item>
            );
          }}
        </ProFormDependency>

        <ProForm.Item
          name="supportedModels"
          label="Suppport models"
          labelCol={{
            span: 5,
          }}
          // rules={[{ required: true, message: 'Please  select' }]}
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              <Col span={24}>
                <Checkbox value="Midjourney">Midjourney</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </ProForm.Item>
      </ProForm>
    </ProCard>
  );
};
