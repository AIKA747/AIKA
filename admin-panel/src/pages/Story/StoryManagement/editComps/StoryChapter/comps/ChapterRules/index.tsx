import { Space } from 'antd';
import ChapterRulesFormElement from './ChapterRulesFormElement';
import './style.less';

export default (props: any) => {
  const { rules, setCurrentChapter, chapterOrder, formRef } = props;
  console.log(rules, formRef);

  return (
    <Space
      style={{ width: '100%' }}
      className="rule-space"
      wrap
      size={[100, 30]}
    >
      {rules?.map((ele: any, index: number) => {
        return (
          <ChapterRulesFormElement
            rule={ele}
            key={index}
            setCurrentChapter={setCurrentChapter}
            chapterOrder={chapterOrder}
            id={ele.key} //每个rule的id
          />
        );
      })}
    </Space>
  );
};
