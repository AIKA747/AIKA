# SplashScreen

## 动画设计细节

### 1. 动画序列设计

- 阶段1 (0-600ms)：Logo 从80%大小放大到100%并淡入
- 阶段2 (600-1400ms)：应用名称淡入并从下方20px位置上移
- 阶段3 (2800-2600ms)：背景放大120%并淡出
- 阶段4 (3600ms)：动画完成回调 (这个最好是在应用前置数据加载完成后触发)

### 2. 动画曲线

- 使用 `Easing.out(Easing.exp)` 实现平滑的加速曲线
- 使用 `Easing.in(Easing.exp)` 实现平滑的减速曲线
- 使用 `withDelay` 精确控制动画时序

### 3. 性能优化

- 使用 `useSharedValue` 替代 `useState` 避免不必要的重渲染
- 所有动画在 UI 线程执行，确保60fps流畅体验
- 使用 `scheduleOnRN` 确保回调在主线程执行

## 组件使用示例

```typescript jsx
import SplashScreen from '@/components/SplashScreen';

export default ()=>{
  const [isLoading, setIsLoading] = useState(true);

  const handleAnimationComplete = () => {
    setIsLoading(false);
  };
  return (
    <View style={styles.container}>
      {isLoading ? (
        <SplashScreen onAnimationComplete={handleAnimationComplete} />
      ) : (
        <HomeScreen />
      )}
    </View>
  )
}
```
