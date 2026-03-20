/*
 * 此 Demo 用演示如何使用 PGYER API 上传 App
 * 详细文档参照 https://www.pgyer.com/doc/view/api#fastUploadApp
 * 适用于 nodejs 项目
 * 本代码需要 npm 包 form-data 支持 运行 npm install --save form-data 即可
 */

/*
 * 以下代码为示例代码，可以在生产环境中使用。使用方法如下:
 *
 * 先实例化上传器
 *
 * const uploader = new PGYERAppUploader(<your api key>);
 *
 * 在上传器实例化以后, 通过调用 upload 方法即可完成 App 上传。
 *
 * upload 方法有两种调用方式
 *
 * 1. 回调方式调用
 *
 *  uploader.upload(uploadOptions: Object, callbackFn(error: Error, result: Object): any): void
 *
 *  示例:
 *  const uploader = new PGYERAppUploader('apikey');
 *  uploader.upload({ filePath: './app.ipa' }, function (error, data) {
 *    // code here
 *  })
 *
 * 2. 使用 promise 方式调用
 *
 * uploader.upload(uploadOptions: Object): Promise
 *
 * 示例:
 * const uploader = new PGYERAppUploader('apikey');
 * uploader.upload({ filePath: './app.ipa' }).then(function (data) {
 *   // code here
 * }).catch(fucntion (error) {
 *   // code here
 * })
 *
 * uploadOptions 参数说明: (https://www.pgyer.com/doc/view/api#fastUploadApp)
 *
 * 对象成员名                是否必选    含义
 * filePath                Y          App 文件的路径，可以是相对路径
 * log                     N          Bool 类型，是否打印 log
 * buildInstallType        N          应用安装方式，值为(1,2,3，默认为1 公开安装)。1：公开安装，2：密码安装，3：邀请安装
 * buildPassword           N          设置App安装密码，密码为空时默认公开安装
 * buildUpdateDescription  N          版本更新描述，请传空字符串，或不传。
 * buildInstallDate        N          是否设置安装有效期，值为：1 设置有效时间， 2 长期有效，如果不填写不修改上一次的设置
 * buildInstallStartDate   N          安装有效期开始时间，字符串型，如：2018-01-01
 * buildInstallEndDate     N          安装有效期结束时间，字符串型，如：2018-12-31
 * buildChannelShortcut    N          所需更新的指定渠道的下载短链接，只可指定一个渠道，字符串型，如：abcd
 *
 *
 * 返回结果
 *
 * 返回结果是一个对象, 主要返回 API 调用的结果, 示例如下:
 *
 * {
 *   code: 0,
 *   message: '',
 *   data: {
 *     buildKey: 'xxx',
 *     buildType: '1',
 *     buildIsFirst: '0',
 *     buildIsLastest: '1',
 *     buildFileKey: 'xxx.ipa',
 *     buildFileName: '',
 *     buildFileSize: '40095060',
 *     buildName: 'xxx',
 *     buildVersion: '2.2.0',
 *     buildVersionNo: '1.0.1',
 *     buildBuildVersion: '9',
 *     buildIdentifier: 'xxx.xxx.xxx',
 *     buildIcon: 'xxx',
 *     buildDescription: '',
 *     buildUpdateDescription: '',
 *     buildScreenshots: '',
 *     buildShortcutUrl: 'xxxx',
 *     buildCreated: 'xxxx-xx-xx xx:xx:xx',
 *     buildUpdated: 'xxxx-xx-xx xx:xx:xx',
 *     buildQRCodeURL: 'https://www.pgyer.com/app/qrcodeHistory/xxxx'
 *   }
 * }
 *
 */
import axios from 'axios';

import { configType } from '@/constants/Config';

import PGYERAppUploader from './PGYERAppUploader';

const API_KEY = '03198cb8c6f002d814778319138e7430';
const APP_PATH_IOS = '../ios/aika/aika.ipa';
const APP_PATH_ANDROID = '../android/app/build/outputs/apk/release/app-release.apk';
// const APP_PATH_ANDROID_AAB = '../android/app/build/outputs/apk/release/app-release.apk';

// 上传iOS
function uploadIOS() {
  const uploader = new PGYERAppUploader(API_KEY);
  uploader.upload(
    {
      // apiKey: API_KEY,
      filePath: APP_PATH_IOS, // 上传文件路径
      log: true, // 显示 log
      // buildInstallType: 2, // 安装方式:  2 为密码安装
      // buildPassword: '123456', // 安装密码
      buildInstallType: 1, // 安装方式:  2 为密码安装
      buildPassword: '123456', // 安装密码
    },
    (error, result) => {
      if (error) {
        console.error('UploadIOS error:', error);
        const content = `AIKA iOS APP ${configType} 版本更新失败`;
        console.error(content);
      } else {
        console.log('UploadIOS result:', JSON.stringify(result, null, 2));
        const { buildVersion, buildVersionNo, buildBuildVersion, buildShortcutUrl, buildCreated } = result.data;
        notice({
          buildType: 'iOS',
          buildVersion,
          buildVersionNo,
          buildBuildVersion,
          buildShortcutUrl,
          buildCreated,
        });
      }
    },
  );
}

// 上传Android
function uploadAndroid() {
  const uploader = new PGYERAppUploader(API_KEY);
  uploader.upload(
    {
      // apiKey: API_KEY,
      filePath: APP_PATH_ANDROID, // 上传文件路径
      log: true, // 显示 log
      // buildInstallType: 2, // 安装方式:  2 为密码安装
      // buildPassword: '123456', // 安装密码
      buildInstallType: 1, // 安装方式:  2 为密码安装
      buildPassword: '123456', // 安装密码
    },
    (error, result: any) => {
      if (error) {
        console.error('UploadAndroid error:', error);
        // const content = `AIKA APP Android ${configType} 版本更新失败，版本号：${buildVersion}(${buildVersionNo})，构建版本号：${buildBuildVersion}](https://www.pgyer.com/${buildShortcutUrl})`;
        const content = `AIKA Android APP ${configType} 版本更新失败`;
        // notice(content);
        console.error(content);
      } else {
        console.log('UploadAndroid result:', JSON.stringify(result, null, 2));
        const { buildVersion, buildVersionNo, buildBuildVersion, buildShortcutUrl, buildCreated } = result.data;
        notice({
          buildType: 'Android',
          buildVersion,
          buildVersionNo,
          buildBuildVersion,
          buildShortcutUrl,
          buildCreated,
        });
      }
    },
  );
}

function notice({
  buildType,
  buildVersion,
  buildVersionNo,
  buildBuildVersion,
  buildShortcutUrl,
  buildCreated,
}: {
  buildType: 'Android' | 'iOS';
  buildVersion: string;
  buildVersionNo: string;
  buildBuildVersion: string;
  buildShortcutUrl: string;
  buildCreated: string;
}) {
  const content =
    'AIKA - NEXT【' +
    configType +
    '】' +
    buildType +
    ' APP <font color="info">** v ' +
    buildVersion +
    '（' +
    buildVersionNo +
    '）' +
    ' **</font> 版本已更新。\n\n' +
    '<font color="info">蒲公英构建版本号：</font> <font color="comment">' +
    buildBuildVersion +
    '</font>\n\n' +
    '<font color="info">发布时间：</font> <font color="comment">' +
    buildCreated +
    '</font>\n\n' +
    '<font color="info">更新内容：</font>\n' +
    '><font color="comment">1、修复 [若干 trello 上反馈的](https://trello.com/invite/b/67c130d89c5b1b06c4b12edc/ATTIae78be91306de7b4e0de0a6d64b26cc2D42111B9/aika-new) 问题 </font>\n' +
    '><font color="comment">2、优化产品体验 </font>\n' +
    '\n\n' +
    '[>> 立即安装更新 <<](https://www.pgyer.com/' +
    buildShortcutUrl +
    ')';
  const data = JSON.stringify({
    msgtype: 'markdown',
    markdown: {
      content,
    },
  });
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=2afcfd9e-0772-454f-b25a-29b1ce6b65ed', // 企业群“AIKA项目组”
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}

uploadIOS();
uploadAndroid();
