import { deepClone, getUuid } from '@/utils';
import { Button, Input, Space, Tag } from 'antd';
import { useState } from 'react';
import './tags.less';

export default (props: any) => {
  const { value: Tags = [], onChange } = props;
  // console.log({ Tags });

  // const [tags, setTags] = useState<any[]>([]); //{ name: '', id: '' }
  const [tagValue, setTageValue] = useState();

  return (
    <Space direction="vertical" className="tags-wrap">
      {Tags?.length > 0 && (
        <Space size={[0, 8]} wrap>
          {Tags?.map((ele: any, index: number) => (
            <Tag
              color="gold"
              key={index}
              closable
              style={{ minWidth: 20 }}
              onClose={() => {
                // 有bug，删除某一个后渲染却失去多个. 删除后面任意tag不会出现上述情况
                const tagsUpdate = deepClone(Tags).filter((tag) => {
                  return tag.id !== ele.id;
                });
                // console.log({ tagsUpdate });

                // setTags(tagsUpdate);
                onChange?.(tagsUpdate);
                // formRef.current?.setFieldValue('tags', tagsUpdate);
              }}
            >
              {ele.name}
            </Tag>
          ))}
        </Space>
      )}

      <Space>
        <Input
          placeholder="enter tag"
          size="small"
          allowClear
          value={tagValue?.name}
          onChange={(e) => {
            setTageValue({
              name: e.target.value,
              id: getUuid(),
            });
          }}
        />
        <Button
          type="primary"
          size="small"
          onClick={() => {
            if (!tagValue?.name?.trim()) return;
            // formRef.current?.setFieldValue('tags', [...tags, tagValue]);
            // setTags((v) => [...v, tagValue]);
            onChange?.([...Tags, tagValue]);
            setTageValue({});
          }}
        >
          Add
        </Button>
      </Space>
    </Space>
  );
};
