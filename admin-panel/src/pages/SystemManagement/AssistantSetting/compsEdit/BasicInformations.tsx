import { getBotManageDic } from '@/services/api/botService';
import { getUuid } from '@/utils';
import { PlusOutlined } from '@ant-design/icons';
import {
  ProCard,
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormSlider,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Row,
  Space,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import BotProfession from './botProfession';
import CustomUpload from './CustomUpload';
import Rules from './Q&ARules';
const { Link } = Typography;

export default (props: any) => {
  const { formRef, data, rules, setRules } = props;

  const [digitalHuman, setDigitalHuman] = useState([]);
  const [isConversationStyleEdited, setConversationStyleEdited] =
    useState<boolean>(false);

  useEffect(() => {
    if (Array.isArray(data?.rules) && data.rules.length > 0) {
      setRules(data.rules);
    }
    if (data?.digitaHumanService) {
      setDigitalHuman(data.digitaHumanService);
    }
  }, [data, setRules, setDigitalHuman]);

  return (
    <ProCard>
      <ProForm
        layout="horizontal"
        formRef={formRef}
        submitter={false}
        initialValues={{
          salutationFrequency: 0,
          salutationPrompts: 'NONE',
          prompts: 'NONE',
          rules: [
            {
              key: '001',
              rule: {
                question: 'NONE',
                answer: 'NONE',
                weight: 1,
              },
            },
          ],
        }}
        labelCol={{
          span: 5,
        }}
      >
        <h3 style={{ color: 'blue', marginTop: 50 }}>Basic Infomation</h3>
        <Divider style={{ marginTop: 0 }} />

        <ProForm.Item
          name="maleAvatar"
          label="Male avatar"
          labelCol={{
            span: 5,
          }}
          rules={[{ required: true, message: 'Plese select!' }]}
        >
          <CustomUpload />
        </ProForm.Item>

        <ProForm.Item
          name="femaleAvatar"
          label="Female avatar"
          labelCol={{
            span: 5,
          }}
          rules={[{ required: true, message: 'Plese select!' }]}
        >
          <CustomUpload />
        </ProForm.Item>

        <ProFormTextArea
          width="lg"
          name={'greetWords'}
          placeholder="Nice to meet you!"
          label="Greet words"
          fieldProps={{
            rows: 4,
          }}
          rules={[{ required: true, message: 'Please  eneter' }]}
        />

        <h3 style={{ color: 'blue', marginTop: 50 }}>Bot Prompt</h3>
        <Divider style={{ marginTop: 0 }} />
        <Row>
          <Col span={12}>
            {!data ? (
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
                marks={{
                  0: '0',
                  100: 'without',
                }}
                rules={[{ required: true, message: 'Please set' }]}
              />
            ) : (
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
                      marks={{
                        0: '0',
                        [age]: `${age}`,
                        100: 'without',
                      }}
                      rules={[{ required: true, message: 'Please set' }]}
                    />
                  );
                }}
              </ProFormDependency>
            )}
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
          label="Character"
          rules={[{ required: true, message: 'Please enter' }]}
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
          labelCol={{
            span: 5,
          }}
          rules={[{ required: true, message: 'Please enter' }]}
        />

        <h3 style={{ color: 'blue', marginTop: 50 }}>Answer Stratogy</h3>
        <Divider style={{ marginTop: 0 }} />
        <ProFormSelect
          mode="multiple"
          name="answerStrategy"
          label="Conversation style"
          width="md"
          fieldProps={{
            labelInValue: true,
          }}
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
          rules={[{ required: true, message: 'Please enter' }]}
          onChange={() => {
            setConversationStyleEdited(true);
          }}
        />

        <h3 style={{ color: 'blue', marginTop: 100 }}>
          Recommendation Strategy
        </h3>
        <Divider style={{ marginTop: 0 }} />
        <ProFormSelect
          name="botRecommendStrategy"
          label="Robot rule"
          width="md"
          labelCol={{
            span: 5,
          }}
          fieldProps={{
            labelInValue: true,
          }}
          // request={async () => []}
          options={[
            { label: 'Popular', value: 'popular' },
            {
              label: 'Balance',
              value: 'balance',
            },
            { label: 'Random', value: 'random' },
          ]}
          rules={[{ required: true, message: 'Please select' }]}
        />

        <ProFormSelect
          name="storyRecommendStrategy"
          label="Story rule"
          width="md"
          labelCol={{
            span: 5,
          }}
          fieldProps={{
            labelInValue: true,
          }}
          // request={async () => []}
          options={[
            { label: 'Popular', value: 'popular' },
            {
              label: 'Balance',
              value: 'balance',
            },
            { label: 'Random', value: 'random' },
          ]}
          rules={[{ required: true, message: 'Please select' }]}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 100,
          }}
        >
          <h3 style={{ color: 'blue' }}>Q&A Rules</h3>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            danger
            onClick={() => {
              setRules((v) => {
                return [...v, { key: getUuid(), rule: {} }];
              });
            }}
          >
            Add rule
          </Button>
        </div>
        <Divider style={{ marginTop: 0 }} />
        <Space
          style={{ width: '100%' }}
          className="rule-space"
          wrap
          size={[100, 30]}
        >
          {rules?.map((ele) => {
            return (
              <Rules
                key={ele.key}
                formRef={formRef}
                rule={ele}
                setRules={setRules}
                id={ele.key}
                rules={rules}
              />
            );
          })}
        </Space>
        <div style={{ display: 'none' }}>
          <ProFormText width="xl" name={'rules'} label="" />
        </div>

        <h3 style={{ marginTop: 50 }}></h3>

        <div style={{ display: 'none' }}>
          <h3 style={{ color: 'blue', marginTop: 100 }}>Add-on</h3>
          <Divider style={{ marginTop: 0 }} />
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
                      marks={{
                        0: '0',
                        [salutationFrequency]: `${salutationFrequency}`,
                        100: 'without',
                      }}
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
            label="Salution prompts"
            labelCol={{
              span: 5,
            }}
            placeholder="Please enter"
            rules={[{ required: true, message: 'Please enter' }]}
          />

          <ProFormTextArea
            width="xl"
            name={'prompts'}
            labelCol={{
              span: 5,
            }}
            placeholder="Please enter"
            label="Prompts"
            fieldProps={{
              rows: 4,
            }}
            rules={[{ required: true, message: 'Please enter' }]}
          />
        </div>

        <ProFormDependency
          name={[
            'age',
            'personalStrength',
            'botCharacter',
            'answerStrategy',
            'profession',
          ]}
        >
          {({
            age,
            personalStrength,
            botCharacter: Character,
            answerStrategy,
            profession,
          }) => {
            console.log(answerStrategy);
            let strategy =
              answerStrategy
                ?.map((ele, index) => `${index + 1}. ` + ele)
                .join(' ') || ' ';
            if (isConversationStyleEdited) {
              strategy = answerStrategy
                .map((ele, index) => `${index + 1}. ` + ele.value)
                .join(' ');
            }

            let a = `Let's role-play,you are a assistant,you are ${age} years old. `;
            let b = `Your profession is ${profession}. `;
            let c = `Your experience covers ${Character} and ${personalStrength}`;
            let d = `Remember, you always maintain: ${strategy}, when chatting with people. `;

            let prompt = a + b + c + d;
            // Let's role-play,you are a assistant.you are { age } years old.
            // Your profession is {Role's Profession}.Your experience covers {Charactrr}. and {Personal strength}.
            // Remember, you always maintain {Conversation style} when chatting with people.

            return (
              <ProForm.Item
                name="prompts"
                label="Prompts preview"
                labelCol={{
                  span: 5,
                }}
              >
                <h4>{prompt}</h4>
              </ProForm.Item>
            );
          }}
        </ProFormDependency>

        <ProForm.Item
          name="digitaHumanService"
          label="Digita human service"
          labelCol={{
            span: 5,
          }}
        >
          <Checkbox.Group
            style={{ width: '100%' }}
            onChange={(v) => {
              setDigitalHuman(v);
            }}
            value={digitalHuman}
          >
            <Row>
              <Col span={12}>
                <Checkbox value="femaleDigitaHuman">
                  Female digita human
                </Checkbox>
              </Col>
              <Col span={12}>
                <Link
                  onClick={() =>
                    history.push(
                      `/systemManagement/assistant-setting/digit-profile/${data?.id}?gender=FEMALE`,
                    )
                  }
                >
                  Edit profile
                </Link>
              </Col>
              <Col span={12}>
                <Checkbox value="maleDigitaHuman">Male digital human</Checkbox>
              </Col>
              <Col span={12}>
                <Link
                  onClick={() =>
                    history.push(
                      `/systemManagement/assistant-setting/digit-profile/${data?.id}?gender=MALE`,
                    )
                  }
                >
                  Edit profile
                </Link>
              </Col>
            </Row>
          </Checkbox.Group>
        </ProForm.Item>
      </ProForm>
    </ProCard>
  );
};
