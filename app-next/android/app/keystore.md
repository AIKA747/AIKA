# https://reactnative.cn/docs/signed-apk-android

# 此为测试用的key生成方式

# 1、创建 keystore

```bash
    keytool -genkeypair -v -storetype PKCS12 -keystore aika-release-key.keystore -alias aika-release-key -keyalg RSA -keysize 2048 -validity 10000
```
证书内容
```
  输入密钥库口令:parsec0236
  再次输入新口令:parsec0326
  您的名字与姓氏是什么?
  [Unknown]:  umaylab
  
  您的组织单位名称是什么?
  [Unknown]:  umaylab
  您的组织名称是什么?
  [Unknown]:  aika
  您所在的城市或区域名称是什么?
  [Unknown]:  cq
  您所在的省/市/自治区名称是什么?
  [Unknown]:  cq
  该单位的双字母国家/地区代码是什么?
  [Unknown]:  china
  CN=aika, OU=umaylab, O=aika, L=cq, ST=cq, C=china是否正确?
  [否]:  Y

```


# 2、谷歌来签名 用JAVA20+ [参考](https://blog.csdn.net/yizdream/article/details/136163207)

```bash
    java -jar pepk.jar --keystore=aika-release-key.keystore --alias=aika-release-key --output=output.zip --include-cert --rsa-aes-encryption --encryption-key-path=encryption_public_key.pem
```

# 3、创建 upload_certificate.pem  (可选)

```bash 
  keytool -export -rfc -keystore aika-release-key.keystore -alias aika-release-key -file upload_certificate.pem
  # 输入密钥库口令:parsec0236
```


# facebook 查看密钥

```bash
keytool -exportcert -alias aika-release-key -keystore aika-release-key.jks | openssl SHA1 -binary | openssl base64 u+X2zWYiUoPpKS7nwkaiXZFE9gs= keytool -exportcert -alias aika-release-key -keystore aika-release-key.keystore | openssl SHA256 -binary | openssl base64 qVKqXMnsVRToBzdIoOe+iqTCTRVVMrxYI5OwNLF2n3E=
```

# 查看密钥 apk META-INF/CERT.RSA

```bash
    keytool -list -printcert -jarfile app.apk | grep "SHA1: " | cut -d " " -f 3 | xxd -r -p | openssl base64 keytool -printcert -file CERT.RSA
```

# facebook 密钥 （暂时未开通）

正在为以下对象生成 2,048 位RSA密钥对和自签名证书 (SHA256withRSA) (有效期为 10,000 天): CN=fuchuan, OU=parsec, O=parsec, L=cq, ST=cq, C=chian

---

# 查看详情
```bash
    keytool -list -v -alias aika-release-key -keystore aika-release-key.keystore

    or

    keytool -keystore aika-release-key.keystore -list -v
```

```
输入密钥库口令:  
密钥库类型: PKCS12
密钥库提供方: SUN

您的密钥库包含 1 个条目

别名: aika-release-key
创建日期: 2025年6月6日
条目类型: PrivateKeyEntry
证书链长度: 1
证书[1]:
所有者: CN=umaylab, OU=umaylab, O=aika, L=cq, ST=cq, C=china
发布者: CN=umaylab, OU=umaylab, O=aika, L=cq, ST=cq, C=china
序列号: fb0b86fcea9b8dd7
生效时间: Fri Jun 06 09:21:26 CST 2025, 失效时间: Tue Oct 22 09:21:26 CST 2052
证书指纹:
         SHA1: 3C:29:CB:20:EA:87:C6:EB:96:99:99:B4:55:D3:EA:5E:5A:A6:6A:B7
         SHA256: D3:F2:46:57:16:53:CE:92:AA:02:C9:03:60:95:41:53:2B:F4:04:AA:41:1E:20:5E:CE:66:CF:7B:35:AB:8F:88
签名算法名称: SHA256withRSA
主体公共密钥算法: 2048 位 RSA 密钥
版本: 3

扩展: 

#1: ObjectId: 2.5.29.14 Criticality=false
SubjectKeyIdentifier [
KeyIdentifier [
0000: 3B 6E AC B5 6F 56 A2 A7   63 84 B3 C7 4B 14 42 4E  ;n..oV..c...K.BN
0010: 29 2B 83 6C                                        )+.l
]
]


```
# 查看 APK 签名信息

```bash 
  
  # 使用 keytool 查看 APK 签名信息
  keytool -printcert -jarfile app-release.apk

  # 使用 apksigner 验证签名
  apksigner verify --print-certs app-release.apk

  # 通过 CERT.RSA 文件查看签名
  keytool -printcert -file META-INF/CERT.RSA
```
---

$ cd android

# 打包 apk

$ ./gradlew assembleRelease

# 打包 aab

$ ./gradlew bundleRelease

# 安装

$ adb install app/build/outputs/apk/release/app-release.apk $ ./gradlew installGooglePlayDebug
