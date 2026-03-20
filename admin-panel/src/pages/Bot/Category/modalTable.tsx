import {
  getBotManageCategoryCanSelectBots,
  getBotManageCategoryId,
  putBotManageCategory,
} from '@/services/api/leixinglanmuguanli';
import { ActionType, ModalForm, ProTable } from '@ant-design/pro-components';
import { useParams, useRequest } from '@umijs/max';
import { Button, message, Space } from 'antd';
import { useCallback, useRef } from 'react';

export default (props: any) => {
  const { id } = useParams();
  const { data: details } = useRequest(
    () =>
      getBotManageCategoryId({
        id,
      }),
    {
      manual: id === 'new',
    },
  );
  const {
    ModalVisible,
    setModalVisible,
    actionRef,
    initBotIds,
    botSource = 'userCreated',
    setIds,
  } = props;

  const actionRef2 = useRef<ActionType>();

  const columnsmodel = [
    {
      title: 'Bots name',
      dataIndex: 'botName',
    },
    {
      title: 'User name',
      dataIndex: 'creatorName',
    },
  ];

  /**
   * 批量--设置
   */
  const handleChoicestBatch = useCallback(
    async (botIds: number[]) => {
      const { categoryName, introduction, categoryId } = details;
      const hide = message.loading('saving...', 0);
      putBotManageCategory({
        botIds: [...botIds, ...initBotIds],
        categoryName,
        introduction,
        categoryId,
      })
        .then((res) => {
          console.log(res);
          hide();
          if (res.code === 0) {
            message.success('Success', 1.5, () => {
              actionRef2.current?.reload();
              actionRef.current?.reload();
              setModalVisible(false);
            });
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [details, actionRef, initBotIds, setModalVisible],
  );

  return (
    <ModalForm
      title={false}
      layout="horizontal"
      open={ModalVisible}
      autoFocusFirstInput
      submitter={{
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          setModalVisible(false);
          // actionRef.current?.reload();
        },
      }}
    >
      <ProTable<any>
        actionRef={actionRef2}
        rowKey="botId"
        search={{
          labelWidth: 100,
        }}
        rowSelection={{
          fixed: true,
        }}
        tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          <Space size={24}>
            <span> {selectedRowKeys.length} selected</span>
            <Button
              type="primary"
              onClick={() => {
                console.log(selectedRowKeys, selectedRows);
                const botIds = selectedRows.map((ele) => {
                  return ele.botId;
                });
                handleChoicestBatch(botIds);
                setIds(botIds);
              }}
            >
              Add
            </Button>
          </Space>
        )}
        request={async (params) => {
          const { data } = await getBotManageCategoryCanSelectBots({
            ...params,
            pageNo: Number(params.current),
            pageSize: Number(params.pageSize),
            categoryId: details?.categoryId,
            botSource,
          });

          return {
            data: data.list || [],
            success: true,
            total: data.total,
          };
        }}
        columns={columnsmodel}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
          pageSizeOptions: [100, 50, 20, 10, 5],
        }}
        dateFormatter="string"
      />
    </ModalForm>
  );
};
