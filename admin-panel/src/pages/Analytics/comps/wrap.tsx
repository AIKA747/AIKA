import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { useCallback, useState } from 'react';
import DateRangePicker from '../comps/dateRangePicker';
import './wrap.less';

const PageWrap = (props: any) => {
  const { Overviews, items, rangeType, setRange } = props;
  const [tab, setTab] = useState('0');
  const onChange = useCallback(async (key: string) => {
    setTab(key);
  }, []);

  return (
    <PageContainer
      ghost
      title={false}
      breadcrumbRender={false}
      style={{ minWidth: 1200 }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 30,
        }}
      >
        {Overviews}
      </div>

      <ProCard gutter={[24, 24]} direction={'column'} className="procard-down">
        <div className="date-picker-wrap">
          <DateRangePicker rangeType={rangeType} setRange={setRange} />
        </div>
        <Tabs
          // defaultActiveKey="1"
          activeKey={tab}
          items={items}
          onChange={onChange}
          indicator={{
            size: (origin) => origin - 16
          }}
          destroyInactiveTabPane={true}
        />
      </ProCard>
    </PageContainer>
  );
};

export default PageWrap;
