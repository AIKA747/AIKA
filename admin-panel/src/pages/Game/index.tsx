import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import {
  deleteBotManageGameId,
  getBotManageGame,
  getBotManageGameId,
  putBotManageGame,
  putBotManageGameEnable,
} from '@/services/api/gameguanlixin';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Image, Input, message, Modal } from 'antd';
import { useCallback, useRef, useState } from 'react';

export default () => {
  const actionRef = useRef<ActionType>();

  const [isEditing, setIsEditing] = useState<any>({});
  const [sortValue, setSortValue] = useState<any>({});

  // 删除操作
  const handleDelete = async (record) => {
    Modal.confirm({
      title: 'Warning',
      content: 'Are you sure to delete?',
      onOk: async () => {
        try {
          const res = await deleteBotManageGameId({
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

  const handleEnable = useCallback(async (record: any) => {
    const hide = message.info('saving...');
    putBotManageGameEnable({
      id: record.id,
      enable: record.enable ? false : true,
    } as any)
      .then((res) => {
        if (res.code === 0) {
          hide();
          message.success('Success');
          actionRef.current?.reload();
        } else {
          message.error(res.msg || res.msg);
        }
      })
      .catch((err) => message.error(err));
  }, []);

  const columns: ProColumns<API.Game>[] = [
    {
      title: 'Name',
      dataIndex: 'gameName',
      editable: false,
      align: 'left',
      render: (_v, record) =>
        record?.gameName ? <span>{record?.gameName}</span> : '-',
      hideInSearch: true,
      width: 100,
    },
    {
      title: 'Sort',
      align: 'center',
      hideInSearch: true,
      render: (_v, record) => {
        const handleSave = async () => {
          const hide = message.info('saving...');
          try {
            const details = await getBotManageGameId({ id: '' + record.id });
            const res = await putBotManageGame({
              ...details.data,
              orderNum: +sortValue[record.id],
            });
            if (res.code === 0) {
              hide();
              message.success('Success');
              actionRef.current?.reload();
              setIsEditing((v: any) => ({ ...v, [record.id]: false }));
            } else {
              message.error(res.msg);
            }
          } catch (err) {
            message.error('Failed to update sort');
          }
        };

        return (
          <ActionsWrap max={3}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isEditing[record.id] ? (
                <Input
                  value={sortValue[record.id]}
                  onChange={(e) =>
                    setSortValue((v: any) => ({
                      ...v,
                      [record.id]: e.target.value,
                    }))
                  }
                  style={{ width: '100px' }}
                />
              ) : (
                <div style={{ textAlign: 'center', width: '80%' }}>
                  {record.orderNum || '0'}
                </div>
              )}
              {isEditing[record.id] ? (
                <SaveOutlined
                  onClick={handleSave}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <EditOutlined
                  onClick={() => {
                    setIsEditing((v: any) => ({ ...v, [record.id]: true }));
                    setSortValue((v: any) => ({
                      ...v,
                      [record.id]: record.orderNum,
                    }));
                  }}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </div>
          </ActionsWrap>
        );
      },
      width: 200,
    },

    {
      title: 'Cover',
      dataIndex: 'listCover',
      editable: false,
      hideInSearch: true,
      align: 'center',
      render: (_v, record) => {
        return <Image width={100} height={100} src={record.listCover} />;
      },
      width: 200,
    },
    {
      title: 'Online',
      dataIndex: 'status', //@pick(['Enable','Disabled'])
      editable: false,
      valueType: 'select',
      valueEnum: {
        Enable: 'Enable',
        Disabled: 'Disabled',
      },
      align: 'center',
      render: (_v, record) => {
        return (
          <ActionsWrap max={3}>
            <div style={{ userSelect: 'none' }}>
              <span
                style={
                  record.enable
                    ? { color: '#3b5ff9', cursor: 'not-allowed' }
                    : { color: '#666', cursor: 'pointer' }
                }
                onClick={() => {
                  if (record.enable) {
                    return;
                  }
                  handleEnable(record);
                }}
              >
                {'Enabled'}
              </span>
              <span style={{ margin: 10, color: '#666' }}>|</span>
              <span
                style={
                  record.enable
                    ? { color: '#666', cursor: 'pointer' }
                    : { color: '#3b5ff9', cursor: 'not-allowed' }
                }
                onClick={() => {
                  if (!record.enable) {
                    return;
                  }
                  handleEnable(record);
                }}
              >
                {'Disabled'}
              </span>
            </div>
          </ActionsWrap>
        );
      },
      hideInSearch: true,
      width: 100,
    },

    {
      title: 'Action',
      align: 'center',
      dataIndex: 'option',
      fixed: 'right',
      width: 280,
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => {
              history.push('/game/edit/' + record.id);
            }}
          >
            Edit
          </LinkButton>
          <LinkButton
            onClick={() => {
              history.push(
                `/game/result/${record.id}?gameName=${record.gameName}`,
              );
            }}
          >
            Result setting
          </LinkButton>

          <Button type="link" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </ActionsWrap>
      ),
    },
  ];

  return (
    <PageContainer
      title={'Game Management'}
      extra={
        <Button
          onClick={() => {
            history.push(`/game/edit/new`);
          }}
        >{`Add new`}</Button>
      }
    >
      <ProCard title={'List'} style={{ marginBlockEnd: 24 }}>
        <ProTable<API.Game>
          actionRef={actionRef}
          rowKey="id"
          search={false}
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
            } = await getBotManageGame({
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
