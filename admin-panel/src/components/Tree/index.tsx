import type { TreeDataNode } from 'antd';
import { Tree } from 'antd';
// import { useEffect, useState } from 'react';
export type TreeValue = string | number[];

export default ({
  tree,
  value,
  onChange,
}: {
  tree: TreeDataNode[];
  value?: TreeValue;
  onChange?: (value1: TreeValue, value2: TreeValue) => void;
}) => {
  return (
    <div
      style={{
        width: '440px',
        boxShadow: '0px 2px 8px 0px #00000026',
        padding: '8px 4px',
        borderRadius: '2px',
      }}
    >
      <Tree
        checkable
        checkedKeys={value}
        treeData={tree}
        onCheck={(checkedKeysValue, e) => {
          const halfCheckedKeys: TreeValue = e.halfCheckedKeys || [];

          if (onChange) {
            onChange(checkedKeysValue, halfCheckedKeys);
          }
        }}
      />
    </div>
  );
};
