# Toast

## 使用法

```tsx
// 引入组件
import Toast from '@/components/Toast';

// 手动关闭 duration = 0 时 不会自动关闭 Toast
const toast = Toast.success({ content: 'success...', duration: 0 });
setTimeout(() => {
  Toast.hide(toast);
}, 2000);

// 成功提示
Toast.success({ content: 'success...' });

// 提示提示
Toast.info({ content: 'info...' });

// 警告提示
Toast.warning({ content: 'warning...' });

// 错误提示
Toast.error({ content: 'error...' });

// 支持直接传递需要提示的文本信息
Toast.info('info...');

//关闭回调
Toast.success({
  content: 'success...',
  onClose: () => {
    console.log('Closed!');
  },
});
```
