import { getUuid } from '@/utils';
import { DeleteOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDigit,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useEffect, useRef } from 'react';
import './style.less';

export default (props: any) => {
  const { rule, rules, setRules, id, formRef: formRefUp } = props;
  // console.log(rule, id);
  const formRef = useRef();

  useEffect(() => {
    if (rule && formRef.current) {
      formRef.current.setFieldsValue(rule.rule);
    }
  }, [rule, formRef]);

  return (
    <div style={{ width: '100%', position: 'relative', zIndex: 9999 }}>
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
          setRules((rules) => {
            const _rules = rules.filter((rule) => rule.key !== id);
            formRefUp.current.setFieldValue('rules', _rules);
            return _rules;
          });
          // return deepClone(rule); // 深拷贝后就实现响应数据
        }}
      />
      <ProForm
        formRef={formRef}
        // initialValues={{...rule.rule}}
        submitter={false}
        layout="horizontal"
        style={{ background: '#d9d9d9', padding: 20, width: '100%' }}
        labelCol={{
          span: 7,
        }}
        onValuesChange={(_, values) => {
          console.log(values);
          // setRules((rules) => {
          //   const _rules = rules.map((ele) => {
          //     if (ele.key === id)
          //       return {
          //         key: getUuid(),
          //         rule: values,
          //       };
          //     return ele;
          //   });
          //   formRefUp.current.setFieldValue('rules', _rules);
          //   return _rules;
          // });
          const _rules = rules.map((ele) => {
            if (ele.key === id)
              return {
                key: getUuid(),
                rule: values,
              };
            return ele;
          });
          formRefUp.current.setFieldValue('rules', _rules);
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
          rules={[{ required: true, message: 'Please enter' }]}
        />
        <ProFormTextArea
          allowClear
          width="lg"
          name="answer"
          label="Answer"
          placeholder="Please enter"
          fieldProps={{
            rows: 3,
          }}
          rules={[{ required: true, message: 'Please enter' }]}
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
