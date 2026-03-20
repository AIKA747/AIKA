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
// PGYERAppUploader.ts
import FormData from 'form-data';
import fs from 'fs';
import https from 'https';
import querystring from 'querystring';

interface UploadOptions {
  filePath: string;
  log?: boolean;
  buildInstallType?: 1 | 2 | 3;
  buildPassword?: string;
  buildUpdateDescription?: string;
  buildInstallDate?: 1 | 2;
  buildInstallStartDate?: string;
  buildInstallEndDate?: string;
  buildChannelShortcut?: string;
}

interface CallbackFn {
  (error: Error | null, result?: any): void;
}

interface UploadResponse {
  code: number;
  message: string;
  data: {
    buildKey: string;
    buildType: string;
    buildIsFirst: string;
    buildIsLastest: string;
    buildFileKey: string;
    buildFileName: string;
    buildFileSize: string;
    buildName: string;
    buildVersion: string;
    buildVersionNo: string;
    buildBuildVersion: string;
    buildIdentifier: string;
    buildIcon: string;
    buildDescription: string;
    buildUpdateDescription: string;
    buildScreenshots: string;
    buildShortcutUrl: string;
    buildCreated: string;
    buildUpdated: string;
    buildQRCodeURL: string;
  };
}

interface COSTokenResponse {
  code: number;
  message: string;
  data: {
    endpoint: string;
    params: {
      signature: string;
      'x-cos-security-token': string;
      key: string;
    };
    key: string;
  };
}

class PGYERAppUploader {
  private readonly LOG_TAG = '[PGYER APP UPLOADER]';
  private readonly apiKey: string;
  private uploadOptions!: UploadOptions;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public upload(options: UploadOptions, callback?: CallbackFn): Promise<UploadResponse> | void {
    if (typeof options.filePath !== 'string') {
      throw new Error('filePath must be a string');
    }

    this.uploadOptions = options;

    if (callback) {
      this.uploadApp(callback);
    } else {
      return new Promise((resolve, reject) => {
        this.uploadApp((error, data) => (error ? reject(error) : resolve(data)));
      });
    }
  }

  private uploadApp(callback: CallbackFn): void {
    // Step 1: Get upload token
    const uploadTokenRequestData = querystring.stringify({
      ...this.uploadOptions,
      _api_key: this.apiKey,
      buildType: this.uploadOptions.filePath.split('.').pop(),
    });

    this.uploadOptions.log && console.log(`${this.LOG_TAG} Check API Key...`);

    const uploadTokenRequest = https.request(
      {
        hostname: 'www.pgyer.com',
        path: '/apiv2/app/getCOSToken',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': uploadTokenRequestData.length,
        },
      },
      (response) => {
        if (response.statusCode !== 200) {
          callback(new Error(`${this.LOG_TAG} Service down: cannot get upload token`));
          return;
        }

        let responseData = '';
        response.on('data', (chunk) => (responseData += chunk));
        response.on('end', () => {
          try {
            const responseInfo: COSTokenResponse = JSON.parse(responseData);
            if (responseInfo.code !== 0) {
              callback(new Error(`${this.LOG_TAG} Service error: ${responseInfo.code} - ${responseInfo.message}`));
              return;
            }
            this.uploadToCOS(responseInfo, callback);
          } catch (error) {
            callback(error as Error);
          }
        });
      },
    );

    uploadTokenRequest.on('error', (error) => callback(error));
    uploadTokenRequest.write(uploadTokenRequestData);
    uploadTokenRequest.end();
  }

  private uploadToCOS(uploadData: COSTokenResponse, callback: CallbackFn): void {
    this.uploadOptions.log && console.log(`${this.LOG_TAG} Uploading app...`);

    const fileExists = fs.existsSync(this.uploadOptions.filePath);
    if (!fileExists) {
      callback(new Error(`${this.LOG_TAG} File not found: ${this.uploadOptions.filePath}`));
      return;
    }

    const stat = fs.statSync(this.uploadOptions.filePath);
    if (!stat.isFile()) {
      callback(new Error(`${this.LOG_TAG} Path is not a file: ${this.uploadOptions.filePath}`));
      return;
    }

    const form = new FormData();
    form.append('signature', uploadData.data.params.signature);
    form.append('x-cos-security-token', uploadData.data.params['x-cos-security-token']);
    form.append('key', uploadData.data.params.key);
    form.append('x-cos-meta-file-name', this.uploadOptions.filePath.replace(/^.*[\\/]/, ''));
    form.append('file', fs.createReadStream(this.uploadOptions.filePath));

    form.submit(uploadData.data.endpoint, (error, response) => {
      if (error) {
        callback(error);
        return;
      }

      if (response.statusCode === 204) {
        setTimeout(() => this.getUploadResult(uploadData, callback), 1000);
      } else {
        callback(new Error(`${this.LOG_TAG} Upload failed with status: ${response.statusCode}`));
      }
    });
  }

  private getUploadResult(uploadData: COSTokenResponse, callback: CallbackFn): void {
    const request = https.request(
      {
        hostname: 'www.pgyer.com',
        path: `/apiv2/app/buildInfo?_api_key=${this.apiKey}&buildKey=${uploadData.data.key}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': 0,
        },
      },
      (response) => {
        let responseData = '';
        response.on('data', (chunk) => (responseData += chunk));
        response.on('end', () => {
          try {
            const result: UploadResponse = JSON.parse(responseData);
            if (result.code === 1247) {
              this.uploadOptions.log && console.log(`${this.LOG_TAG} Parsing app data...`);
              setTimeout(() => this.getUploadResult(uploadData, callback), 1000);
            } else if (result.code !== 0) {
              callback(new Error(`${this.LOG_TAG} API Error: ${result.code} - ${result.message}`));
            } else {
              callback(null, result);
            }
          } catch (error) {
            callback(error as Error);
          }
        });
      },
    );

    request.on('error', (error) => callback(error));
    request.end();
  }
}

export default PGYERAppUploader;
