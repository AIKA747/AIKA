import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import {
  getContentManagePostReports,
  getContentManageReportList,
} from '@/services/api/tiezijubaoguanli';
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
import { useRef } from 'react';

// 举报内容对象
interface Report {
  id: number;
  reportId: number;
  postId: number;
  createdAt: string;
  postAuthorName: string;
  postAuthorAvatar?: string;
  authorName: string;
  authorAvatar?: string;
}

export default () => {
  const actionRef = useRef<ActionType>();

  // 获取举报分类
  const { data: reportTypeList } = useRequest(
    () => getContentManageReportList(),
    {
      manual: false,
    },
  );

  const columns: ProColumns<Report>[] = [
    {
      title: 'Report type',
      dataIndex: 'reportId',
      width: 200,
      valueType: 'select',
      fieldProps: {
        options: (reportTypeList?.data || []).map((x: any) => {
          return {
            value: x.id,
            label: x.title,
          };
        }),
      },
    },
    // {
    //   title: 'Cover',
    //   dataIndex: 'cover',
    //   width: 100,
    //   hideInSearch: true,
    //   render: (_, record) =>
    //     record.postAuthorAvatar ? <Image width={100} src={record.postAuthorAvatar} /> : '-',
    // },
    {
      title: 'Post Author Name',
      dataIndex: 'postAuthorName',
      editable: false,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: 'Author Name',
      dataIndex: 'authorName',
      editable: false,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: 'Created Time',
      dataIndex: 'createdAt',
      align: 'center',
      editable: false,
      hideInSearch: true,
      render: (_v, record) =>
        record?.createdAt
          ? dayjs(record?.createdAt).format('YYYY-MM-DD HH:mm:ss')
          : '-',
    },
    {
      title: 'Action',
      align: 'left',
      dataIndex: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => {
              history.push('/contentManagement/reportList/' + record.postId);
            }}
          >
            View
          </LinkButton>
        </ActionsWrap>
      ),
    },
  ];

  return (
    <PageContainer title={'Report content'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<Report>
          headerTitle="Report content"
          actionRef={actionRef}
          rowKey={'id'}
          search={{
            labelWidth: 140,
            span: 12,
          }}
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
            } = await getContentManagePostReports({
              ...newParams,
            });

            return {
              data: list || [],
              success: true,
              total,
            };
          }}
          columns={columns}
          dateFormatter="string"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
        />
      </ProCard>
    </PageContainer>
  );
};
