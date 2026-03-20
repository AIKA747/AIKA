import { getBotManageCategoryBots } from '@/services/api/leixinglanmuguanli';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import ModalTable from './modalTable';

export default (props: any) => {
  const { setIds } = props;
  const { id } = useParams();

  const actionRef = useRef<ActionType>();
  const [ModalVisible, setModalVisible] = useState(false);
  const [initBotIds, setInitBotIds] = useState<string[]>([]);

  const columns = [
    {
      title: 'Bot name',
      dataIndex: 'botName',
      width: 100,
    },
    {
      title: 'Source',
      dataIndex: 'botSource',
      width: 100,
      valueEnum: {
        builtIn: 'builtIn',
        userCreated: 'userCreated',
      },
    },
  ];

  return (
    <>
      <ProTable<any>
        headerTitle=""
        actionRef={actionRef}
        rowKey="botId"
        search={{
          labelWidth: 115,
          defaultCollapsed: false,
          // layout: 'vertical'
        }}
        submitRender={false}
        request={async (params, sorter, filter) => {
          const { data } = await getBotManageCategoryBots({
            ...params,
            categoryId: id,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
            pageNo: params.current || 1,
            pageSize: params.pageSize || 10,
          });
          setInitBotIds(data?.list?.map((ele) => ele.botId) || []);
          return {
            data: data?.list || [],
            total: data?.total,
            success: true,
          };
        }}
        toolBarRender={() => [
          <Button key="1" type="primary" onClick={() => setModalVisible(true)}>
            {"Add User's bot"}
          </Button>,
        ]}
        columns={columns as any}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
          showSizeChanger: true,
        }}
      />

      <ModalTable
        ModalVisible={ModalVisible}
        setModalVisible={setModalVisible}
        categoryId={id}
        actionRef={actionRef}
        initBotIds={initBotIds}
        setIds={setIds}
      />
    </>
  );
};
