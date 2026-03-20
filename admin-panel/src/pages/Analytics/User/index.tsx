import {
  getAdminActiveUsersLineChart,
  getAdminAnalyticsTodayActiveUsers,
  getAdminAnalyticsTodayInactiveUsers,
  getAdminAnalyticsTodayNewUsers,
  getAdminAnalyticsTodayTotalUsers,
  getAdminCountryUserCountRanking,
  getAdminInactiveUsersLineChart,
  getAdminNewUsersLineChart,
  getAdminTotalUsersLineChart,
} from '@/services/api/yonghutongji';
import { ProCard } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Divider, message } from 'antd';
import { useMemo, useState } from 'react';
import ChartBox from '../comps/chartBox';
import Wrap from '../comps/wrap';
import { processVacantNumber } from '../tool';

const Page: React.FC = () => {
  const { data: CountryData } = useRequest(getAdminCountryUserCountRanking, {
    onSuccess(res) {
      if (res.code !== 0) {
        message.error('user-count-ranking error');
      }
    },
    onError() {
      message.error('user-count-ranking error');
    },
  });
  const { data: NewUsers } = useRequest(getAdminAnalyticsTodayNewUsers);

  const { data: ActiveUsers } = useRequest(getAdminAnalyticsTodayActiveUsers);

  const { data: InactiveUsers } = useRequest(
    getAdminAnalyticsTodayInactiveUsers,
  );

  const { data: TotalUsers } = useRequest(getAdminAnalyticsTodayTotalUsers);

  const Overviews = useMemo(() => {
    if (
      NewUsers?.data &&
      ActiveUsers?.data &&
      InactiveUsers?.data &&
      TotalUsers?.data
    ) {
      return (
        <>
          <ProCard
            bordered
            title="New Users"
            tooltip="The number of newly registered users today."
            style={{ maxWidth: '24%' }}
          >
            <h2>{NewUsers.data.newUsers}</h2>
            <div>{processVacantNumber(NewUsers.data.wowChange)}</div>
            <div>{processVacantNumber(NewUsers.data.dodChange)}</div>
            <Divider
              type="horizontal"
              style={{ background: '#f1f1f1', margin: '12px 0' }}
            />
            <div>{`Daily New Users ${NewUsers.data.dailyNewUsers.toFixed(
              2,
            )}`}</div>
          </ProCard>
          <ProCard
            bordered
            title="Active Users"
            tooltip="The number of logged-in users today."
            style={{ maxWidth: '24%' }}
          >
            <h2>{ActiveUsers.data.activeUsers}</h2>
            <div>{processVacantNumber(ActiveUsers.data.wowChange)}</div>
            <div>{processVacantNumber(ActiveUsers.data.dodChange)}</div>
            <Divider
              type="horizontal"
              style={{ background: '#f1f1f1', margin: '12px 0' }}
            />
            <div>{`Daily Active Users ${ActiveUsers.data.dailyActiveUsers.toFixed(
              2,
            )}`}</div>
          </ProCard>
          <ProCard
            bordered
            title="Inactive Users"
            tooltip="The number of users who have not logged in for 30 days so far."
            style={{ maxWidth: '24%' }}
          >
            <h2>{InactiveUsers.data.inactiveUsers}</h2>
            <div>{processVacantNumber(InactiveUsers.data.wowChange)}</div>
            <div>{processVacantNumber(InactiveUsers.data.dodChange)}</div>
            <Divider
              type="horizontal"
              style={{ background: '#f1f1f1', margin: '12px 0' }}
            />
            <div>{`Daily Inactive Users ${InactiveUsers.data.inactiveUsers}`}</div>
          </ProCard>
          <ProCard
            bordered
            title="Total Users"
            tooltip="The number of all registered users so far."
            style={{ maxWidth: '24%' }}
          >
            <h2>{TotalUsers.data.totalUsers}</h2>
            <div>{processVacantNumber(TotalUsers.data.wowChange)}</div>
            <div>{processVacantNumber(TotalUsers.data.dodChange)}</div>
            <Divider
              type="horizontal"
              style={{ background: '#f1f1f1', margin: '12px 0' }}
            />
            <div>{`Total Subscribers ${TotalUsers.data.totalSubscribers}`}</div>
          </ProCard>
        </>
      );
    }
  }, [
    NewUsers?.data,
    ActiveUsers?.data,
    InactiveUsers?.data,
    TotalUsers?.data,
  ]);

  const [rangeType, setRange] = useState({});

  const items = [
    {
      key: '0',
      label: 'New User',
      children: (
        <ChartBox
          type="User"
          label="New User"
          color="green"
          api={getAdminNewUsersLineChart}
          CountryDataList={CountryData?.data?.list || []}
          params={{ ...rangeType }}
        />
      ),
    },
    {
      key: '1',
      label: 'Active User',
      children: (
        <ChartBox
          type="User"
          label="Active User"
          color="green"
          api={getAdminActiveUsersLineChart}
          CountryDataList={CountryData?.data?.list || []}
          params={{ ...rangeType }}
        />
      ),
    },
    {
      key: '2',
      label: 'Inactive User',
      children: (
        <ChartBox
          type="User"
          label="Inactive User"
          color="green"
          api={getAdminInactiveUsersLineChart}
          CountryDataList={CountryData?.data?.list || []}
          params={{ ...rangeType }}
        />
      ),
    },
    {
      key: '3',
      label: 'Total User',
      children: (
        <ChartBox
          type="User"
          label="Total User"
          color="green"
          api={getAdminTotalUsersLineChart}
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
