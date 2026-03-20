# AIKA APP

## Get started

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

   ```bash
   pnpm run start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## 开发规范 使用yarn

Entertainment.json https://dev.appsflyer.com/hc/docs/react-native-plugin

生成App icon https://icon.wuruihong.com/

组件以文件夹型式组织，不同功能代码独立到不同文件。index.tsx 主要页面文件、styles.tsx 样式、types.ts 类型、 constants.tsx 常量。

xcode-select -r

xcodebuild clean xcodebuild archive -workspace aika.xcworkspace -scheme aika -archivePath aika.xcarchive xcodebuild -exportArchive -exportOptionsPlist export.plist -archivePath aika.xcarchive -exportPath aika

xcodebuild archive -project aika.xcodeproj -scheme aika -archivePath aika.xcarchive xcodebuild -exportArchive -archivePath aika.xcarchive -exportPath aika xcodebuild -exportArchive -exportOptionsPlist ExportOptions.plist -archivePath aika.xcarchive -exportPath aika

在旧版macbook上安装最新macos https://sysin.org/blog/install-macos-13-on-unsupported-mac/#3-%E6%97%A0%E9%9C%80-Verbose-%E6%88%96-OpenCore-Picker-%E5%8D%B3%E5%8F%AF%E6%97%A0%E7%BC%9D%E5%90%AF%E5%8A%A8 下载OpenCore Legacy Patcher，14.1 spoof 到15.2，安装option选择启动

<hr />

## ICON

所有图标均来自[设计稿](https://www.figma.com/design/y0aaylXDxkcgnIoli5BxSq/AIKA-App?node-id=381-7157&p=f&t=cHY5TURL2YFECkDB-0)中提取;

### 命名规则

1. 线框风格

```typescript jsx
 组件命名： 组件名 + Outline  => 例：MessagesOutline
 文件命名： 小写组件名 + -outline => 例：messages-outline
```

2. 实体风格

```typescript jsx
 组件命名： 组件名 + Filled  => 例：MessagesFilled
 文件命名： 小写组件名 + -filled => 例：messages-filled
```

3. 双色风格

```typescript jsx
 组件命名： 组件名 + TwoTone  => 例：MessagesTwoTone
 文件命名： 小写组件名 + -two-tone => 例：messages-two-tone
```

### 提取步骤

1. 选择你需要提取的图标，一般为24 \* 24 px 大小的图标；
2. 复制图标后，新建一个 Figma 文件；
3. 安装 SVG to React / Native / SolidJS 插件；
4. 在新的 Figma 文件中，选择复制的图标，右键选择 Plugins > SVG to React / Native / SolidJS;就会打开插件编辑窗口，编辑完成后点击 ‘Save as file’ 按钮，保存图片；
5. 将下载的 `.tsx` 文件，复制到 `Icons` 图标文件夹下；修改文件中的 `fill` 属性为 `currentColor`；
6. 在 `Icons` 文件夹下的 `index.ts` 中加入你下载的图标，具体格式参考现有的导出方式；
7. 接下来就可以在需要使用图标的代码中使用你的图标了；

注意： 双色风格的图标需要额外新增 twoToneColor 属性，具体操作可以参考下面代码

```typescript jsx

import Svg, { Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {
  twoToneColor?: string; // 双色图标的颜色
}

export const MessagesTwoTone = (props: IProps) => {
  return (
    <Svg width="25" height="24" viewBox="0 0 25 24" fill="currentColor" {...props}>
      <Path
        fill="currentColor"
        d="M12.375 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10c0 1.6.376 3.112 1.043 4.453.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 0 0 1.591 1.592l2.226-.596a1.63 1.63 0 0 1 1.149.133A9.96 9.96 0 0 0 12.375 22"
      />
      <Path
        fill={props?.twoToneColor || 'currentColor'}
        d="M15.375 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0M11.375 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0M7.375 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0"
      />
    </Svg>
  );
};


```

完成后你也可以访问：`/iconPreview` 页面进行预览所有图标，修改 [utils/devAutoRouterPush.tsx](utils/devAutoRouterPush.tsx) 文件中的 `router.push({ pathname, params });` 进行默认打开。

### 使用 Icon

```typescript jsx
import { View } from 'react-native';

export default () => {
  return (<View>
    <MessagesOutline color='#A07BED' />
    <MessagesFilled color='#A07BED' />
    <MessagesTwoTone color='#A07BED' twoToneColor='#fff' />
  </View>)
}

```

更多图标查询[这里](https://www.figma.com/design/y0aaylXDxkcgnIoli5BxSq/AIKA-App?node-id=1505-29696&t=15mhPNx6IUL0VT4j-0)

<hr />

## [s3ImageTransform.ts](utils/s3ImageTransform.ts) 使用方式

s3ImageTransform 主要是将 AWS S3 上存储的图片资源进行本地转换，根据设置的参数返回对应大小的图片。

```typescript jsx

import { View, ViewBase } from 'react-native';

export default () => {
  return (
    <View>
      <Image
        source={{ uri: s3ImageTransform(item.avatar, 'small') }}
      />
    </View>
  )
}

```

### API

| 参数名       | 说明           | 类型                                           | 是否必填 | 默认值 |
| ------------ | -------------- | ---------------------------------------------- | -------- | ------ |
| `url`        | s3 图片链接    | `string`                                       | `true`   | -      |
| `sizeOption` | 图片格式化选项 | `SizePreset` \| `number` \| `[number, number]` | `false`  | -      |

#### SizePreset

| key      | value          | 说明               |
| -------- | -------------- | ------------------ |
| `small`  | `[160, 160]`   | 160 X 160 的图片   |
| `middle` | `[480, 480]`   | 480 X 480 的图片   |
| `large`  | `[600, 600]`   | 600 X 600 的图片   |
| `1024`   | `[1024, 1024]` | 1024 X 1024 的图片 |

<hr />

## 版本号定义指南

### 1. 标准版本号格式（推荐）

`<主版本号>.<次版本号>.<补丁版本号>.<热修复版本号>`

例如：

```
 1 . 3 . 0
└┬┘ └┬┘ └┬┘
 │   │   └─ 补丁、热修复版本号 (hotfix 0)
 │   └─── 补丁版本号 (patch 3)
 └─────── 主次版本号 (feature release 1)
```

### 2. 语义化版本控制（SemVer）扩展

语义化版本控制（SemVer）是一个广泛使用的版本控制规范，旨在通过版本号传达软件的变更类型和兼容性。以下是 SemVer 的基本规则：

| 版本段           | 规则                                                     | 示例   |
| ---------------- | -------------------------------------------------------- | ------ |
| 主版本号         | 重大功能变更时递增，向后不兼容的 API 修改， 热修复不修改 | 1 → 2  |
| 次版本号         | 新增功能时递增，热修复不修改                             | 3 → 4  |
| 补丁、热修版本号 | 每次发布热修复包递增（0 表示正式版）                     | 0 → 01 |

<hr />
