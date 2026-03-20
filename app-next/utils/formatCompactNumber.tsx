/**
 * 将数字转换为紧凑格式（如 1K, 2.1K, 10M）
 * @param num 需要格式化的数字
 * @returns 格式化后的字符串
 */
export function formatCompactNumber(num: number): string {
  type Unit = { symbol: string; value: number };

  // 定义单位阶梯（从大到小排列）
  const units: Unit[] = [
    { symbol: 'B', value: 1e9 }, // Billion
    { symbol: 'M', value: 1e6 }, // Million
    { symbol: 'K', value: 1e3 }, // Thousand
    { symbol: '', value: 1 }, // Default
  ];

  // 边界处理：处理负数和小数
  const absoluteNum = Math.abs(num);
  let selectedUnit: Unit = units[units.length - 1];

  // 寻找符合条件的最大单位
  for (const unit of units) {
    if (absoluteNum >= unit.value) {
      const result = absoluteNum / unit.value;
      if (result < 1000) {
        selectedUnit = unit;
        break;
      }
    }
  }

  // 计算结果并保留精度
  const result = num / selectedUnit.value;
  const isNegative = num < 0;
  const formattedResult = formatResult(result);

  // 拼接最终结果
  return `${isNegative ? '-' : ''}${formattedResult}${selectedUnit.symbol}`;
}

/**
 * 格式化结果数字
 * @param result 计算结果
 * @returns 处理后的字符串
 */
function formatResult(result: number): string {
  const absoluteResult = Math.abs(result);

  // 整数处理
  if (absoluteResult % 1 === 0) {
    return absoluteResult.toFixed(0);
  }

  // 小数处理（保留1位，移除末尾.0）
  return absoluteResult.toFixed(1).replace(/\.0$/, '');
}
