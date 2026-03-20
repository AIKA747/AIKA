export const validateEmail = (email: string) => {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

/**
 * 至少8位，包含大小写字母或数字或特殊字符中的任意3种
 * @param pwd
 * @returns
 */
export const validatePwd = (pwd?: string) => {
  if (!pwd) return;
  if (pwd.length < 8) {
    return false;
  }

  let count = 0;

  // 数字
  if (/\d/.test(pwd)) {
    count++;
  }

  // 小写字母
  if (/[a-z]/.test(pwd)) {
    count++;
  }

  // 大写字母
  if (/[A-Z]/.test(pwd)) {
    count++;
  }

  // 特殊字符
  if (/[!@#$%^&*()_+]/.test(pwd)) {
    count++;
  }

  return count >= 3;
};
