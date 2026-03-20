import { Tabs } from 'antd';
import { useState } from 'react';
// import Audio from './tabsComps/Audio';
import Script from './tabsComps/Script';
// import Video from './tabsComps/Video';

export default (props: any) => {
  const { data } = props;
  const [activeKey] = useState();

  return (
    <Tabs
      activeKey={activeKey}
      onChange={() => {}}
      items={[
        {
          label: `Script`,
          key: 'script',
          children: <Script data={data} />,
        },
        // {
        //   label: `Audio`,
        //   key: 'audio',
        //   children: <Audio data={data} />,
        // },
        // {
        //   label: `Video`,
        //   key: 'video',
        //   children: <Video data={data} />,
        // },
      ]}
    />
  );
};
