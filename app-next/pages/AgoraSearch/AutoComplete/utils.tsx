/**
 * 解析关键字
 * @param str
 * @param keyword
 */
export const resolveKeywords = (str: string, keyword: string) => {
  const re = [];
  while (str.length) {
    const index = str.indexOf(keyword);
    if (index !== -1) {
      if (index !== 0) {
        // 不是开头就匹配上关键词,要把没匹配上的拿出来，比如  "iloveyou" "love" => ["i","love", "you"]
        re.push(str.slice(0, index));
      }
      re.push(str.slice(index, index + keyword.length)); // 把关键词截取出来
      str = str.slice(index + keyword.length); // 截取到末尾
    } else {
      re.push(str);
      break;
    }
  }
  return re;
};
