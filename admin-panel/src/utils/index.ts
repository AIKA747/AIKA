import { LOGIN_PATH } from '@/utils/constants';
import { history } from '@umijs/max';

// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}

export function toLogin() {
  if (window.location.pathname !== LOGIN_PATH) {
    history.replace(
      `${LOGIN_PATH}?${new URLSearchParams({
        redirectTo: window.location.href,
      })}`,
    );
  }
}

export function getQueryParam(name: string) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = window.location.search.substring(1).match(reg);
  if (r !== null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

export function htmlToText(html: string): string {
  const reg = /<[^>]*>|<\/[^>]*>/gm;
  return html.replace(reg, '');
}

/**
 * 防抖
 * @param function
 * @param number
 * @return
 */
export const debounce = (fn, delay?: number) => {
  const delays = delay || 500;
  let timer: any;
  return function () {
    // const th = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      timer = null;
      fn.apply(null, args);
    }, delays);
  };
};

/**
 * 生成一个用不重复的ID
 * @param randomLength id  长度
 */
export const getUuid = (randomLength = 32): string => {
  return (
    'key:' +
    Number(
      Math.random().toString().substring(2, randomLength) + Date.now(),
    ).toString(36)
  );
};

/**
 * 深拷贝
 * @param obj
 * @returns
 */
export function deepClone(obj: any) {
  console.log(obj);

  let newObj = obj?.constructor === Array ? [] : {};
  if (typeof obj !== 'object') {
    return obj;
  } else {
    for (const i in obj) {
      if (typeof obj[i] === 'object') {
        newObj[i] = deepClone(obj[i]);
      } else {
        newObj[i] = obj[i];
      }
    }
  }
  return newObj;
}

/**
 * 复制到剪切板
 */
export function copyToClipboard(textToCopy: any) {
  const promiseArr: any[] = [];
  if (document.execCommand('copy')) {
    // 创建text area
    let textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    // 使text area不在viewport，同时设置不可见
    textArea.style.position = 'absolute';
    textArea.style.opacity = '0';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    // return

    promiseArr.push(
      new Promise((res, rej) => {
        // 执行复制命令并移除文本框
        const b = document.execCommand('copy');
        console.log('document.execCommand("copy"):', b); //返回 boolean值
        // b ? res(2) : rej(0);
        if (b) {
          res(2);
        } else {
          rej(0);
        }
        textArea.remove();
      }),
    );
  }

  if (navigator.clipboard && window.isSecureContext) {
    //（发布后）在部分手机浏览器环境（Edge），navigator.clipboard会生效
    // navigator clipboard 向剪贴板写文本
    console.log('navigator.clipboard');
    const a = navigator.clipboard.writeText(textToCopy); //返回Promise
    console.log({ a });
    // return

    promiseArr.push(
      new Promise((res, rej) => {
        a.then(() => {
          res(1);
        }).catch((err) => {
          rej(err);
        });
      }),
    );
  }

  return Promise.race(promiseArr);
}

/**
 *
 * @returns
 */
export function isMobile() {
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return true;
  }

  if (/android/i.test(userAgent)) {
    return true;
  }

  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return true;
  }

  return false;
}

export const noSpaceValidator = (rule, value) => {
  if (value !== '' && value.trim() === '') {
    return Promise.reject(
      new Error('Please enter valid content. It cannot be all spaces.'),
    );
  }
  return Promise.resolve();
};
export const lengthLimit = (rule, value, limit = 500) => {
  console.log(value);

  if (value && value.length > limit) {
    return Promise.reject(new Error(`Not more than ${limit} words.`));
  }
  return Promise.resolve();
};

export const wait = function (t = 2000) {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, t);
  });
};
