/**
 * 根据俄语复数规则生成粉丝数显示文本
 * @param count 粉丝数量
 * @param type 'followers' | 'followings' 粉丝或关注者类型
 * @param showNum 是否显示数字
 * @returns 符合俄语复数规则的字符串
 *
 * 规则说明：
 * - 0 → 0 подписчиков | подписок
 * - 1 → 1 подписчик | подписка
 * - 2-4 → 2-4 подписчика | подписки
 * - 5+ 且不以1结尾 → 5 подписчиков | подписок
 * - 以1结尾但非11 → N подписчик | подписка (如21, 101, 351)
 */
export default (count: number, type: 'followers' | 'followings', showNum = false): string => {
  // 处理特殊结尾情况：以1结尾但不是11
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  // 处理以1结尾的非11数字 (21, 31, 101...)
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    const lang = type === 'followers' ? 'Подписчик' : 'Подписка';
    return showNum ? `${count} ${lang}` : lang;
  }

  // 处理常规复数规则
  if (count === 0) {
    const lang = type === 'followers' ? 'Подписчиков' : 'Подписок';
    return showNum ? `0 ${lang}` : lang;
  } else if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14)) {
    const lang = type === 'followers' ? 'Подписчика' : 'Подписки';
    return showNum ? `${count} ${lang}` : lang;
  }
  const lang = type === 'followers' ? 'Подписчиков' : 'Подписок';
  return showNum ? `${count} ${lang}` : lang;
};
/**
 * 根据俄语复数规则生成点赞数的正确词尾
 * @param n 点赞数量
 * @returns 带正确词尾的字符串 (例：21 → "21 лайк")
 */
export function getRussianLike(n: number): string {
  const num = Math.abs(n); // 处理负数
  const lastTwo = num % 100;
  const lastOne = num % 10;

  // 特殊规则：11-14 结尾的统一使用 лайков
  if (lastTwo >= 11 && lastTwo <= 14) {
    return `${n} лайков`;
  }

  // 主规则判断
  switch (lastOne) {
    case 1: // 1, 21, 31... (排除 11 系列)
      return `${n} лайк`;
    case 2: // 2-4 且不在 12-14 范围内
    case 3:
    case 4:
      return `${n} лайка`;
    default: // 其他情况 (0,5-9,10,15-20...)
      return `${n} лайков`;
  }
}
