import { getUuid } from '@/utils';
import { ProCard } from '@ant-design/pro-components';
import { Button } from 'antd';
import MdItem from './MdItem';

const TestQuestions = function ({
  data,
  setQuestions,
}: {
  data: any;
  setQuestions: any;
}) {
  return (
    <ProCard
      title="Assistant AI Setting"
      extra={
        <Button
          onClick={() => {
            setQuestions((v) => [...v, { id: getUuid() }]);
          }}
        >
          Add new
        </Button>
      }
      style={{ paddingRight: 100 }}
    >
      {data.map((ele: any, index: number) => {
        return <MdItem key={index} data={ele} setQuestions={setQuestions} />;
      })}
    </ProCard>
  );
};

export default TestQuestions;
