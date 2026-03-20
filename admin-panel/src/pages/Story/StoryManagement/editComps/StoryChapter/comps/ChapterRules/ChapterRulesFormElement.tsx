import { deepClone, noSpaceValidator } from '@/utils';
import { DeleteOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useEffect, useRef } from 'react';

export default (props: any) => {
  const { rule, setCurrentChapter, id } = props;
  const formRef = useRef();

  useEffect(() => {
    if (rule && formRef.current) {
      formRef.current.setFieldsValue(rule.rule);
    }
  }, [rule, formRef]);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <DeleteOutlined
        style={{
          fontSize: 22,
          color: 'red',
          position: 'absolute',
          zIndex: 999,
          right: 10,
          top: 10,
          padding: 10,
        }}
        onClick={() => {
          setCurrentChapter((chpt) => {
            chpt.chapterRule = chpt.chapterRule.filter((rule) => {
              return rule.key !== id;
            });
            // console.log(chpt.chapterRule, deepClone(chpt));

            return deepClone(chpt); // 深拷贝后就实现响应数据
          });
        }}
      />
      <ProForm
        formRef={formRef}
        submitter={false}
        layout="horizontal"
        style={{ background: '#d9d9d9', padding: 20, width: '100%' }}
        labelCol={{
          span: 7,
        }}
        onValuesChange={(_, values) => {
          console.log(values);
          setCurrentChapter((chpt) => {
            chpt.chapterRule = chpt.chapterRule.map((rule) => {
              if (rule.key === id) {
                return {
                  key: id,
                  rule: values,
                };
              }
              return rule;
            });

            return deepClone(chpt);
          });
        }}
        initialValues={{
          recommendAnswer: '', // 一定要初始化，否则会传null到后端，然后复显编辑都出问题
          question: '',
          weight: 0,
          friendDegree: 0,
          storyDegree: 0,
        }}
      >
        <div style={{ display: 'none' }}>
          <ProFormTextArea
            allowClear
            width="lg"
            name="question"
            label="Question"
            placeholder="Please enter"
          />
        </div>
        <ProFormTextArea
          allowClear
          width="lg"
          name="question"
          label="Question"
          placeholder="Please enter"
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
          width="lg"
          name="recommendAnswer"
          label="Recommended answer"
          placeholder="Please enter"
          fieldProps={{
            rows: 3,
          }}
          // rules={[
          //   {
          //     validator: noSpaceValidator,
          //   },
          // ]}
        />
        <ProFormRadio.Group
          name="friendDegree"
          label="Friend degree value"
          options={[
            {
              label: '-3',
              value: -3,
            },
            {
              label: '-2',
              value: -2,
            },
            {
              label: '-1',
              value: -1,
            },
            {
              label: '0',
              value: 0,
            },
            {
              label: '1',
              value: 1,
            },
            {
              label: '2',
              value: 2,
            },
            {
              label: '3',
              value: 3,
            },
          ]}
          rules={[{ required: true, message: 'Please  eneter' }]}
          fieldProps={{
            style: { marginBottom: 0 },
          }}
        />

        <ProFormRadio.Group
          name="storyDegree"
          label="Story degree value"
          options={[
            {
              label: '-3',
              value: -3,
            },
            {
              label: '-2',
              value: -2,
            },
            {
              label: '-1',
              value: -1,
            },
            {
              label: '0',
              value: 0,
            },
            {
              label: '1',
              value: 1,
            },
            {
              label: '2',
              value: 2,
            },
            {
              label: '3',
              value: 3,
            },
          ]}
          rules={[{ required: true, message: 'Please  eneter' }]}
          fieldProps={{
            style: { marginBottom: 0 },
          }}
        />

        <ProFormDigit
          allowClear
          width="md"
          name="weight"
          label="Weight"
          placeholder="Please enter weight number"
          rules={[{ required: true, message: 'Please enter' }]}
          extra={<h5 style={{ marginBottom: 20 }}>Attach importance</h5>}
        />
      </ProForm>
    </div>
  );
};
