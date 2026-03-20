/**
 * 接口返回的数据数据格式不一定标准，转换成 Tree[]
 */
const clearTree: (params: {
  tree: any[];
  valueField?: string | ((v: any) => void);
  labelField?: string | ((v: any) => void);
  filter?: (v: any) => boolean;
}) => any[] = ({ tree, valueField = 'key', labelField = 'title', filter }) => {
  const arr: any[] = [];
  tree.forEach((x) => {
    if (filter && !filter(x)) {
      return;
    }
    arr.push({
      children: clearTree({ tree: x.childrens || [], valueField, labelField }),
      title: typeof labelField === 'function' ? labelField(x) : x[labelField],
      key: typeof valueField === 'function' ? valueField(x) : x[valueField],
    });
  });
  return arr;
};
export default clearTree;
