// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  importPlugin.flatConfigs.recommended,
  prettierConfig,
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true, // 关键设置
          project: './tsconfig.json',
        }, // 支持 TypeScript
        node: true, // 支持 Node.js 模块
        // 支持路径别名（需与 tsconfig.json 一致）
        // alias: {
        //   map: [['@/', './']],
        //   extensions: ['.js', '.jsx', '.ts', '.tsx'],
        // },
      },
    },
    ignores: ['dist/*'],
    rules: {
      // 导入顺序规则
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node 内置模块
            'external', // 第三方依赖
            'internal', // 项目内部模块
            'parent', // 父级目录
            'sibling', // 同级目录
            'index', // 当前目录
          ],
          'newlines-between': 'always', // 组间空行
          alphabetize: {
            order: 'asc', // 字母顺序
            caseInsensitive: true, // 忽略大小写
          },
          pathGroups: [
            {
              pattern: '@/**', // 路径别名分组
              group: 'internal',
            },
            {
              pattern: '*.css', // 样式文件分组
              group: 'index',
              position: 'after',
            },
          ],
        },
      ],
      // 其他 import 相关规则
      'import/no-unresolved': 0,
      'react/no-unescaped-entities': 0,
    },
  },
]);
