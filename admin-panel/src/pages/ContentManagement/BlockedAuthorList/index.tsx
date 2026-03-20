import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import {
  getContentManageBlockedAuthors,
  putContentManageAuthorUnblocked,
} from '@/services/api/zuozhefengjinguanli';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Image, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';

// 封禁作者对象
interface BlockedAuthor {
  userId: number;
  avatar: string;
  nickname: string;
  username: string;
  createdAt?: string;
  bio?: string;
  caseCleanAt?: string;
  flagNum: number;
}

export default () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<BlockedAuthor>[] = [
    {
      title: 'Author Name',
      dataIndex: 'authorName',
      editable: false,
      hideInTable: true,
      align: 'center',
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      width: 100,
      hideInSearch: true,
      render: (_, record) =>
        record.avatar ? <Image width={100} src={record.avatar} /> : '-',
    },
    {
      title: 'Nick Name',
      dataIndex: 'nickname',
      editable: false,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      editable: false,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: 'Number of Sensitive Posts',
      dataIndex: 'flagNum',
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
              if (record.userId) {
                Modal.confirm({
                  title: `Are you sure Unblock this author?`,
                  okType: 'danger',
                  onOk: () => {
                    const hide = message.loading('loading...', 0);
                    putContentManageAuthorUnblocked({
                      userId: record.userId,
                    }).then(() => {
                      hide();
                      message.success(
                        'Operation successful，About to refresh',
                        1.5,
                        () => {
                          actionRef.current?.reload();
                        },
                      );
                    });
                  },
                });
              }
            }}
          >
            Unblock
          </LinkButton>
        </ActionsWrap>
      ),
    },
  ];

  return (
    <PageContainer title={'Blocked Author List'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<BlockedAuthor>
          headerTitle="Blocked Author List"
          actionRef={actionRef}
          rowKey={'userId'}
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
            } = await getContentManageBlockedAuthors({
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
