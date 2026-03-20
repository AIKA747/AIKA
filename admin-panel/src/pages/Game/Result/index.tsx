import {
  deleteBotManageGameGameResultId,
  getBotManageGameIdGameResult,
  postBotManageGameGameResult,
  putBotManageGameGameResult,
} from '@/services/api/gameguanlixin';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useLocation, useParams } from '@umijs/max';
import { Button, Image, message, Modal } from 'antd';
import { useRef, useState } from 'react';
import GameResultModal from './GameResultModal'; // 引入通用弹层组件

const GameResultPage = () => {
  const { id } = useParams();
  const { search } = useLocation();
  const gameName = new URLSearchParams(search).get('gameName');
  const actionRef = useRef<any>();
  const formRef = useRef();
  const [visible, setVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      const api = currentRecord
        ? putBotManageGameGameResult
        : postBotManageGameGameResult;
      const res = await api({
        ...values,
        gameId: id,
        ...(currentRecord ? { id: currentRecord.id } : {}), // 如果是编辑，传入记录 ID
      });
      if (res.code === 0) {
        message.success(currentRecord ? 'Edit success' : 'Add success');
        setVisible(false);
        actionRef.current?.reload();
      } else {
        message.error(res.msg || 'Operation failed');
      }
    } catch (error) {
      message.error('Operation failed');
    }
  };

  // 打开新建弹层
  const handleAdd = () => {
    setCurrentRecord(null); // 清空当前记录
    setVisible(true); // 打开弹层
  };

  // 打开编辑弹层
  const handleEdit = (record: any) => {
    // console.log(record);
    setCurrentRecord(record); // 设置当前记录
    setVisible(true); // 打开弹层
  };

  // 删除操作
  const handleDelete = async (record) => {
    Modal.confirm({
      title: 'Warning',
      content: 'Are you sure to delete?',
      onOk: async () => {
        try {
          const res = await deleteBotManageGameGameResultId({
            id: '' + record.id,
          });
          if (res.code === 0) {
            message.success('Deleted successfully');
            actionRef.current?.reload();
          } else {
            message.error(res.msg || 'Failed to delete');
          }
        } catch (error) {
          message.error('Failed to delete');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Summary',
      dataIndex: 'summary',
      width: 100,
    },
    {
      title: 'Cover',
      dataIndex: 'cover',
      width: 100,
      render: (cover: string) => <Image width={100} src={cover} />,
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: (_, record: any) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable
        headerTitle={`${gameName || ''}`}
        actionRef={actionRef}
        rowKey="categoryId"
        search={false}
        toolBarRender={() => [
          <Button type="default" key="back" onClick={() => history.back()}>
            Back
          </Button>,
          <Button type="primary" key="add" onClick={handleAdd}>
            Add
          </Button>,
        ]}
        request={async () => {
          const { data } = await getBotManageGameIdGameResult({
            id: '' + id,
          });
          return {
            data: data,
            total: data.length,
            success: true,
          };
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
        }}
      />

      {/* 通用弹层组件 */}
      <GameResultModal
        visible={visible}
        onVisibleChange={setVisible}
        onSubmit={handleSubmit}
        record={currentRecord}
        formRef={formRef}
      />
    </PageContainer>
  );
};

export default GameResultPage;
