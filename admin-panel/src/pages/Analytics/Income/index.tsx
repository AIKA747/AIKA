import {} from '@/services/api/dingyuetongji';
import {
  getAdminAnalyticsIncomeMonth,
  getAdminAnalyticsIncomeWeek,
  getAdminAnalyticsIncomeYear,
  getAdminCountryIncomeRanking,
  getAdminDailyIncomeLineChart,
  getAdminTotalIncomeLineChart,
} from '@/services/api/shourutongji';
import { ProCard } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Divider } from 'antd';
import { useMemo, useState } from 'react';
import ChartBox from '../comps/chartBox';
import Wrap from '../comps/wrap';

const Page: React.FC = () => {
  const { data: CountryData } = useRequest(getAdminCountryIncomeRanking);

  const { data: IncomeWeek } = useRequest(getAdminAnalyticsIncomeWeek);

  const { data: IncomeMonth } = useRequest(getAdminAnalyticsIncomeMonth);

  const { data: IncomeYear } = useRequest(getAdminAnalyticsIncomeYear);

  const [rangeType, setRange] = useState({});

  const Overviews = useMemo(() => {
    if (IncomeWeek && IncomeMonth && IncomeYear) {
      return (
        <>
          <ProCard
            bordered
            title="Income(7 days)"
            tooltip="The sum of subscription income in the last 7 days."
            style={{ maxWidth: '24%' }}
          >
            <h2>{'$ ' + (IncomeWeek.data.income / 100).toFixed(2)}</h2>
            <div>{IncomeWeek.data.wowChange}</div>
            <Divider
              type="horizontal"
              style={{ background: '#f1f1f1', margin: '12px 0' }}
            />
            <div>{`Daily Income $ ${(IncomeWeek.data.dailyIncome / 100).toFixed(
              2,
            )}`}</div>
          </ProCard>
          <ProCard
            bordered
            title="Income(this month)"
            tooltip="The sum of subscription income this month."
            style={{ maxWidth: '24%' }}
          >
            <h2>{'$ ' + (IncomeMonth.data.income / 100).toFixed(2)}</h2>
            <div>{IncomeMonth.data.momChange}</div>
            <Divider
              type="horizontal"
              style={{ background: '#f1f1f1', margin: '12px 0' }}
            />
            <div>{`Monthly New Income $ ${(
              IncomeMonth.data.monthlyIncome / 100
            ).toFixed(2)}`}</div>
          </ProCard>
          <ProCard
            bordered
            title="Income(this year)"
            tooltip="The sum of subscription income this year."
            style={{ maxWidth: '24%' }}
          >
            <h2>{'$ ' + (IncomeYear.data.income / 100).toFixed(2)}</h2>
            <div>{IncomeYear.data.yoyChange}</div>
            <Divider
              type="horizontal"
              style={{ background: '#f1f1f1', margin: '12px 0' }}
            />
            <div>
              {`Annual Income $ ${(IncomeYear.data.annualIncome / 100).toFixed(
                2,
              )}`}{' '}
            </div>
          </ProCard>
          <ProCard
            bordered
            title="Total Income"
            tooltip="The sum of total subscription income."
            style={{ maxWidth: '24%' }}
          >
            <h2>{'$ ' + (IncomeYear.data.income / 100).toFixed(2)}</h2>
            <div>{IncomeYear.data.yoyChange}</div>
            <Divider
              type="horizontal"
              style={{ background: '#f1f1f1', margin: '12px 0' }}
            />
            <div>{`Per Subscriber Income $ ${(
              IncomeYear.data.annualIncome / 100
            ).toFixed(2)}`}</div>
          </ProCard>
        </>
      );
    }
  }, [IncomeWeek, IncomeMonth, IncomeYear]);

  const items = [
    {
      key: '0',
      label: 'Daily Income',
      children: (
        <ChartBox
          type="Income"
          label="New Income"
          color="blue"
          formateType="income"
          api={getAdminDailyIncomeLineChart}
          CountryDataList={CountryData?.data.list?.map((ele) => ({
            ...ele,
            data: '$ ' + (ele.data / 100).toFixed(2),
          }))}
          params={{ ...rangeType }}
        />
      ),
    },
    {
      key: '1',
      label: 'Total Income',
      children: (
        <ChartBox
          type="Income"
          label="Total Income"
          color="blue"
          formateType="income"
          api={getAdminTotalIncomeLineChart}
          CountryDataList={CountryData?.data.list?.map((ele) => ({
            ...ele,
            data: '$ ' + (ele.data / 100).toFixed(2),
          }))}
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
