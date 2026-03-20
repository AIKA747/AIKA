import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import { getBotManageDic } from '@/services/api/botService';
import { getUserManageFeedbackList } from '@/services/api/yonghufankui';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

interface AdminPush {
  id?: number;
  title?: string;
  content?: string;
  pushTo?: string;
  soundAlert?: number;
  operator?: string;
  received?: number;
  pushTotal?: number;
  pushTime?: string;
  createdAt?: string;
}

export default () => {
  const actionRef = useRef<ActionType>();
  // console.log(dayjs("2024-05-13T00:52:12Z").format('YYYY-MM-DD HH:mm:ss'));
  // console.log(dayjs("2024-05-13T00:52:12Z").local('zh-cn').format('YYYY-MM-DD HH:mm:ss'));
  // console.log(dayjs("2024-05-13T00:52:12").format('YYYY-MM-DD HH:mm:ss'));
  // console.log(dayjs.locale('es'));

  const [Titles, setTitles] = useState<any>({});
  useRequest(() => getBotManageDic({ dicType: 'feedbackTitle' }), {
    onSuccess(res) {
      setTitles(
        res.data.reduce((oldV, newV) => {
          const { dicValue } = newV;
          return {
            ...oldV,
            [dicValue]: dicValue,
          };
        }, {}) || {},
      );
    },
  });

  const columns: ProColumns<AdminPush>[] = [
    {
      title: 'Status',
      dataIndex: 'status',
      editable: false,
      align: 'center',
      width: 100,
      hideInTable: true,
      valueEnum: {
        underReview: 'underReview',
        pending: 'pending',
        rejected: 'rejected',
        completed: 'completed',
        withdraw: 'withdraw',
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      editable: false,
      align: 'center',
      width: 100,
      valueEnum: {
        ...Titles,
      },
    },
    {
      title: 'Issue ID',
      dataIndex: 'category',
      editable: false,
      align: 'center',
      width: '20%',
      // render(category) {
      //   return (
      //     <>
      //       {feedbackCategory?.data.filter((ele) => ele.id === category)[0]
      //         ?.dicValue || '--'}
      //     </>
      //   );
      // },
      hideInSearch: true,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      editable: false,
      align: 'center',
      width: 100,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      editable: false,
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      editable: false,
      align: 'center',
      width: 100,
      hideInSearch: true,
    },

    {
      title: 'Submit Ttime',
      dataIndex: 'pushTime',
      align: 'center',
      editable: false,
      width: 100,
      render: (_v, record: any) =>
        record?.submissionAt
          ? dayjs(
              record?.submissionAt.substring(
                0,
                record?.submissionAt.length - 1,
              ),
            ).format('YYYY-MM-DD HH:mm:ss')
          : '-',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            minSubmissionAt: `${value[0]} 00:00:00`,
            maxSubmissionAt: `${value[1]} 23:59:59`,
          };
        },
      },
    },
    {
      title: 'Device',
      dataIndex: 'device',
      editable: false,
      align: 'center',
      width: 100,
      hideInTable: true,
    },
    {
      title: 'SystemVersion',
      dataIndex: 'systemVersion',
      editable: false,
      align: 'center',
      width: 100,
      hideInTable: true,
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => {
              history.push(
                '/supportManagement/feedbacklist/detail/' + record.id,
              );
            }}
          >
            View
          </LinkButton>
        </ActionsWrap>
      ),
    },
  ];

  return (
    <PageContainer title={'Feedback List'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<AdminPush>
          actionRef={actionRef}
          rowKey="id"
          headerTitle="Support List"
          search={{
            labelWidth: 100,
          }}
          // options={false}
          request={async (params) => {
            const newParams: any = {
              ...params,
              pageNo: params.current || 1,
              pageSize: params.pageSize || 10,
            };
            delete newParams.size;
            delete newParams.current;

            const {
              data: { list, total },
            } = await getUserManageFeedbackList({
              ...newParams,
            });

            return {
              data: list || [],
              success: true,
              total,
            };
          }}
          columns={columns}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
          dateFormatter="string"
        />
      </ProCard>
    </PageContainer>
  );
};
