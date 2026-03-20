import {
  getAdminAnalyticsNewSubcribersWeek,
  getAdminAnalyticsNewSubscribersMonth,
  getAdminAnalyticsSubscribersNum,
  getAdminCountrySubscriberCountRanking,
  getAdminExpiredSubscribersLineChart,
  getAdminNewSubscribersLineChart,
  getAdminTotalSubscribersLineChart,
} from '@/services/api/dingyuetongji';
import { ProCard } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Divider } from 'antd';
import { useMemo, useState } from 'react';
import ChartBox from '../comps/chartBox';
import Wrap from '../comps/wrap';

const Page: React.FC = () => {
  const { data: CountryData } = useRequest(
    getAdminCountrySubscriberCountRanking,
  );
  const { data: SubcribersWeek } = useRequest(
    getAdminAnalyticsNewSubcribersWeek,
  );
  const { data: SubscribersMonth } = useRequest(
    getAdminAnalyticsNewSubscribersMonth,
  );
  // const SubscribersMonth = useMemo(() => {
  //   return {
  //     data: {
  //       newSubscribers: 100,
  //       momChange: 100,
  //       monthlyNewSubscribers: 100,
  //     },
  //   };
  // }, []);

  const { data: SubscribersNum } = useRequest(getAdminAnalyticsSubscribersNum);

  const Overviews = useMemo(() => {
    if (SubcribersWeek && SubscribersMonth && SubscribersNum) {
      const {
        newSubscribers: newSubscribersWeek,
        wowChange,
        dailyNewSubscribers,
        // dodChange,
      } = SubcribersWeek.data;

      const {
        newSubscribers: newSubscribersMonth,
        momChange,
        monthlyNewSubscribers,
      } = SubscribersMonth.data;

      const {
        totalUsers,
        totalSubscribers,
        upcomingExpiringSubscribers,
        totalExpiredSubscribers,
        totalDodChange,
        totalWowChange,
      } = SubscribersNum.data;

      return (
        <>
          <ProCard
            bordered
            title="New Subscribers(7 days)"
            tooltip="The number of newly subscribed or resubscribed users in the past 7 days."
            style={{ maxWidth: '24%' }}
          >
            <h2>{newSubscribersWeek}</h2>
            <div>{`WoW Change ${wowChange}`}</div>
            <Divider
              type="horizontal"
              style={{ background: '#f1f1f1', margin: '12px 0' }}
            />
            <div>{`Daily New Subscribers  ${dailyNewSubscribers}`}</div>
          </ProCard>
          <ProCard
            bordered
            title="New Subscribers(this month)"
            tooltip="The number of newly subscribed or resubscribed users this month."
            style={{ maxWidth: '24%' }}
          >
            <h2>{newSubscribersMonth}</h2>
            <div>{`MoM Change ${momChange}`}</div>
            <Divider
              type="horizontal"
              style={{ background: '#f1f1f1', margin: '12px 0' }}
            />
            <div>{`Monthly New Subscribers  ${monthlyNewSubscribers}`}</div>
          </ProCard>
          <ProCard
            bordered
            title="Upcoming Expiring Subscriptions"
            tooltip="The number of upcoming expiring subscriptions in 7 days."
            style={{ maxWidth: '24%' }}
          >
            <h2>{upcomingExpiringSubscribers}</h2>
            <Divider
              type="horizontal"
              style={{ background: '#f1f1f1', margin: '12px 0' }}
            />
            <div>
              {`Total Expired Subscriptions  ${totalExpiredSubscribers}`}{' '}
            </div>
          </ProCard>
          <ProCard
            bordered
            title="Total Subscribers"
            tooltip="The number of all valid subscribers so far."
            style={{ maxWidth: '24%' }}
          >
            <h2>{totalSubscribers}</h2>
            <div>{`WoW Change ${totalWowChange}`}</div>
            <div>{`DoD Change ${totalDodChange}`}</div>
            <Divider
              type="horizontal"
              style={{ background: '#f1f1f1', margin: '12px 0' }}
            />
            <div>{`Total users ${totalUsers}`}</div>
          </ProCard>
        </>
      );
    }
  }, [SubcribersWeek, SubscribersMonth, SubscribersNum]);

  const [rangeType, setRange] = useState({});

  const items = [
    {
      key: '0',
      label: 'New Subscribers',
      children: (
        <ChartBox
          type="Subscribers"
          label="New Subscribers"
          color="purple"
          api={getAdminNewSubscribersLineChart}
          CountryDataList={CountryData?.data?.list || []}
          params={{ ...rangeType }}
        />
      ),
    },
    {
      key: '1',
      label: 'Expired Subscribers',
      children: (
        <ChartBox
          type="Subscribers"
          label="Expired Subscribers"
          color="purple"
          api={getAdminExpiredSubscribersLineChart}
          CountryDataList={CountryData?.data?.list || []}
          params={{ ...rangeType }}
        />
      ),
    },
    {
      key: '2',
      label: 'Total Subscribers',
      children: (
        <ChartBox
          type="Subscribers"
          label="Total Subscribers"
          color="purple"
          api={getAdminTotalSubscribersLineChart}
          CountryDataList={CountryData?.data?.list || []}
          params={{ ...rangeType }}
        />
      ),
    },
  ];

  return (
    <Wrap
      items={items}
      Overviews={Overviews}
      rangeType={rangeType}
      setRange={setRange}
    />
  );
};

export default Page;
