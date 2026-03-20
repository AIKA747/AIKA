import { wait } from '@/utils';
import { DeleteOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormInstance,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

function MdItem({ data, setQuestions }: any) {
  const [markdown, setMarkdown] = useState('# Hello, World!');
  const formRef = useRef<ProFormInstance<any>>();

  useEffect(() => {
    data['formRef'] = formRef;
  }, [data, formRef]);

  useEffect(() => {
    if (data) {
      console.log(data);
      formRef.current?.setFieldsValue(data);
      const { questions, options } = data;
      if (questions) {
        setMarkdown(questions);
      } else if (options) {
        setMarkdown(options);
      }
    }
  }, [data, formRef]);

  return (
    <div
      className="md-item"
      style={{
        display: 'flex',
        width: '100%',
        marginBottom: 30,
        background: '#EBEBEB',
        position: 'relative',
      }}
    >
      <ProForm
        onFinish={async (values) => {
          console.log(values);
        }}
        formRef={formRef}
        submitter={false}
        layout="horizontal"
        style={{ width: '55%' }}
      >
        <ProFormTextArea
          name="questions"
          label="Questions"
          fieldProps={{
            onChange: (e) => setMarkdown(e.target.value),
            onFocus: (e) => setMarkdown(e.target.value),
            rows: 6,
          }}
          placeholder="Enter your markdown here..."
          // style={{ height: '300px', resize: 'none' }}
          rules={[{ required: true, message: 'Please enter' }]}
        />
        <ProFormTextArea
          name="options"
          label="Options"
          fieldProps={{
            onChange: (e) => setMarkdown(e.target.value),
            onFocus: (e) => setMarkdown(e.target.value),
            rows: 6,
          }}
          placeholder="Enter your markdown here..."
          // style={{ height: '300px', resize: 'none' }}
          rules={[{ required: true, message: 'Please enter' }]}
        />
      </ProForm>
      <div
        className="preview"
        style={{
          border: '1px solid black',
          marginLeft: 20,
          borderRadius: 4,
          flex: 1,
          maxHeight: 300,
          overflowY: 'auto',
        }}
      >
        <p style={{ fontSize: 20 }}>Preview</p>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>

      <DeleteOutlined
        style={{
          fontSize: 30,
          marginLeft: 20,
          position: 'absolute',
          top: '50%',
          right: -60,
        }}
        onClick={() => {
          wait(600);
          setQuestions((v: any[]) => {
            return v.filter((ele: any) => {
              if (ele.id === data.id) {
                console.log(ele, data);
                return false;
              } else return true;
            });
          });
        }}
      />
    </div>
  );
}

export default MdItem;
