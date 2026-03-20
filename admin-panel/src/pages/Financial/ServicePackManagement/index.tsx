import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';

import {
  deleteOrderManageServicePackageId,
  getOrderManageServicePackage,
  patchOrderManageServicePackageStatus,
} from '@/services/api/fuwubaoguanli';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Badge, Button, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';
import './index.less';

interface OrderManageServicePackage {
  id: number;
  packageName?: string;
  subPeriod?: number;
  price?: number;
  status?: string;
  createdAt?: string;
}

export default () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<OrderManageServicePackage>[] = [
    {
      title: 'Service pack name',
      dataIndex: 'packageName',
      editable: false,
      align: 'center',
    },
    {
      title: 'Subscription period',
      dataIndex: 'subPeriod',
      editable: false,
      align: 'center',
      hideInSearch: true,
      renderText: (v) => v + ' d',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      editable: false,
      hideInSearch: true,
      align: 'center',
      renderText: (text) => '$' + ((text || 0) / 100).toFixed(2),
      // renderText: (text) => '$' + ((text || 0)).toFixed(2),
    },
    {
      title: 'Status', //    integer     状态：Active，Inactive
      dataIndex: 'status',
      editable: false,
      valueType: 'select',
      valueEnum: {
        Active: 'Active',
        Inactive: 'Inactive',
      },
      align: 'center',
      render: (_v, record) => {
        return (
          <Badge
            status={record?.status === 'Active' ? 'success' : 'default'}
            text={record?.status === 'Active' ? 'Active' : 'Inactive'}
          />
        );
      },
    },
    {
      title: 'Visibility', //    integer     是否可见：0否，1是
      dataIndex: 'visiblity',
      editable: false,
      valueType: 'select',
      valueEnum: {
        1: 'Yes',
        0: 'No',
      },
      hideInTable: true,
    },
    {
      title: 'Created time',
      dataIndex: 'createdAt',
      align: 'center',
      editable: false,
      render: (_v, record: any) =>
        record?.createdAt
          ? dayjs(record?.createdAt).format('YYYY-MM-DD HH:mm:ss')
          : '-',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            minCreatedAt: `${value[0]} 00:00:00`,
            maxCreatedAt: `${value[1]} 23:59:59`,
          };
        },
      },
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
              history.push('/financial/servicePackManagement/' + record.id);
            }}
          >
            Edit
          </LinkButton>
          <LinkButton
            onClick={() => {
              Modal.confirm({
                title: `Are you sure change the status？`,
                onOk: () => {
                  const hide = message.loading('loading...', 0);
                  patchOrderManageServicePackageStatus({
                    id: record.id,
                    status: record.status === 'Active' ? 'Inactive' : 'Active',
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
            }}
          >
            {record.status === 'Active' ? 'Inactive' : 'Active'}
          </LinkButton>
          <LinkButton
            onClick={() => {
              Modal.confirm({
                title: `Are you sure delete this item?`,
                icon: <ExclamationCircleFilled />,
                okType: 'danger',
                onOk: () => {
                  const hide = message.loading('loading...', 0);
                  deleteOrderManageServicePackageId({
                    id: record.id,
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
            }}
          >
            Delete
          </LinkButton>
        </ActionsWrap>
      ),
    },
  ];

  return (
    <PageContainer title={'Service pack management'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<OrderManageServicePackage>
          className="ServicePackManagementTable"
          headerTitle="Service pack list"
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 100,
          }}
          options={false}
          toolBarRender={() => [
            <Button
              key={'export'}
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                history.push('/financial/servicePackManagement/new');
              }}
            >
              Add New
            </Button>,
          ]}
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
            } = await getOrderManageServicePackage({
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
