import { getBotManageCategory } from '@/services/api/leixinglanmuguanli';
import { useRequest } from 'ahooks';
import { Select } from 'antd';
import { useMemo, useState } from 'react';

const Types = ({ disabled, value, onChange }: any) => {
  const [Categories, setCategories] = useState([]);
  useRequest(() => getBotManageCategory({ pageNo: 1, pageSize: 999 }), {
    manual: false,
    onSuccess(res) {
      if (res?.code === 0) {
        setCategories(res.data.list);
      }
    },
  });

  const Options = useMemo(() => {
    if (Categories.length > 0) {
      return Categories.map((ele) => ({
        value: ele.categoryId,
        label: ele.categoryName,
      }));
    }
    return [];
  }, [Categories]);

  return (
    <div
      style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}
    >
      <Select
        disabled={disabled}
        style={{ width: 200, marginRight: 20 }}
        value={value?.type}
        onChange={(val) =>
          onChange(!val ? undefined : { type: val, category: '0' })
        }
        options={[
          { value: 'TALES', label: 'Tales' },
          { value: 'EXPERT', label: 'Expert' },
          { value: 'GAME', label: 'Game' },
          { value: 'GROUP_CHAT', label: 'Group Chat' },
        ]}
        allowClear
      />

      {value?.type === 'EXPERT' && (
        <Select
          disabled={disabled}
          style={{ width: 200, marginRight: 20 }}
          value={value?.category}
          onChange={(val) => {
            onChange({
              type: value?.type,
              category: !val ? '0' : val,
            });
          }}
          options={[{ value: '0', label: 'Not bound' }, ...Options]}
          allowClear
        />
      )}
    </div>
  );
};

export default Types;
