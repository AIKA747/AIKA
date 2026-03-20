import { debounce } from '@/utils';
import * as echarts from 'echarts';
import { useCallback, useEffect, useRef } from 'react';

export default (props: any) => {
  const { options, data, minHeight = 500 } = props;

  const ref = useRef<any>();
  const resizeFunc = useCallback(() => {
    if (ref.current) {
      const BarBOX1 = echarts?.init(ref.current);
      BarBOX1?.setOption(options);
      let resize = debounce(() => {
        BarBOX1.resize();
      });
      resize();
    }
  }, [options, ref]);

  useEffect(() => {
    window.addEventListener('resize', resizeFunc);

    const main = document.querySelectorAll('main.parsec-layout-content')[0];
    let resizeObserver = new ResizeObserver(resizeFunc);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    main && resizeObserver.observe(main); //监听main的变化。切换tab时如何解绑？

    return () => {
      // window.removeEventListener('resize', resizeFunc); // 可以顺利解绑
      // resizeObserver.disconnect();
    };
  }, [data, options, resizeFunc]);
  return (
    <div ref={ref} style={{ height: '100%', width: '100%', minHeight }}></div>
  );
};
