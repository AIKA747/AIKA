import { useCallback, useRef } from 'react';

export default function useOnDoublePress(pressDelay = 300) {
  const lastClickTimeRef = useRef<number>(0);
  const clickTimeRef = useRef<NodeJS.Timeout>(undefined);

  const onDoublePress = useCallback(
    ({ onDoubleClick, onClick }: { onClick?: () => void; onDoubleClick?: () => void }) => {
      const now = Date.now();
      // 检查是否为双击
      if (now - lastClickTimeRef.current < pressDelay) {
        clickTimeRef?.current && clearTimeout(clickTimeRef?.current);
        onDoubleClick?.();
      } else {
        // 设置单机超时处理
        clickTimeRef.current = setTimeout(() => {
          onClick?.();
        }, pressDelay);
      }
      lastClickTimeRef.current = now;
    },
    [pressDelay],
  );
  return { onDoublePress };
}
