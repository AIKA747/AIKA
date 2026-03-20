import { getContentManageStory } from '@/services/api/contentService';
import { getBotManageGame } from '@/services/api/gameguanlixin';
import { getBotManageBots } from '@/services/api/jiqirenguanli';
import { getBotManageGroupChatroomList } from '@/services/api/qunliguanlixin';
import { postBotManageSphereBot } from '@/services/api/spherexin';
import { ModalForm, ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Image, message } from 'antd';
import { useEffect, useState } from 'react';

const EditForm = ({
  id,
  type,
  isOpen,
  setOpen,
  actionRef,
  existingBotIds,
  setExistingBotIds,
  category,
  categoryId,
}: any) => {
  console.log('--existingBotIds:', existingBotIds);
  const [list, setList] = useState<any[]>([]);

  const [collectionId, setCollectionId] = useState<number[]>([]);

  const { run: getExpertBots, loading: expertLoading } = useRequest(
    getBotManageBots,
    {
      manual: true,
      onSuccess(res) {
        if (res.code === 0) {
          setList(
            res.data.list.map((ele) => ({
              ...ele,
              name: ele.botName,
              botId: ele.id,
              avatar: ele.botName,
              listCover: ele.botName ?? '',
              listCoverDark: ele.botName ?? '',
              description: ele.botName,
            })),
          );
        }
      },
    },
  );

  const { run: getGameBots, loading: gameLoading } = useRequest(
    getBotManageGame,
    {
      manual: true,
      onSuccess(res) {
        if (res.code === 0) {
          setList(
            res.data.list.map((ele) => ({
              ...ele,
              name: ele.gameName,
              botId: ele.id,
              avatar: ele.avatar,
              listCover: ele.listCover ?? '',
              listCoverDark: ele.listCover ?? '',
              description: ele.listDesc,
            })),
          );
        }
      },
    },
  );

  const { run: getStoryBots, loading: storyLoading } = useRequest(
    getContentManageStory,
    {
      manual: true,
      onSuccess(res) {
        if (res.code === 0) {
          setList(
            res.data.list.map((ele) => ({
              ...ele,
              name: ele.storyName,
              botId: ele.id,
              avatar: ele.image,
              listCover: ele.cover ?? '',
              listCoverDark: ele.cover ?? '',
              description: ele.introduction,
            })),
          );
        }
      },
    },
  );

  const { run: getGroupList, loading: groupLoading } = useRequest(
    getBotManageGroupChatroomList,
    {
      manual: true,
      onSuccess(res) {
        if (res.code === 0) {
          setList(
            res.data.list.map((ele) => ({
              ...ele,
              name: ele.roomName,
              botId: ele.id,
              avatar: ele.roomAvatar,
              listCover: ele.roomAvatar ?? '',
              listCoverDark: ele.roomAvatar ?? '',
              description: ele.description,
            })),
          );
        }
      },
    },
  );

  useEffect(() => {
    if (list?.length) return;

    if (type === 'EXPERT' && isOpen) {
      getExpertBots({
        pageNo: 1,
        pageSize: 999,
        botSource: 'builtIn',
        categoryId: categoryId,
      });
    }
    if (type === 'GAME' && isOpen) {
      getGameBots({ pageNo: '1', pageSize: '999' });
    }
    if (type === 'TALES' && isOpen) {
      getStoryBots({ pageNo: 1, pageSize: 999 });
    }
    if (type === 'GROUP_CHAT' && isOpen) {
      getGroupList({ pageNo: 1, pageSize: 999 });
    }
  }, [isOpen]);

  const columnsmodel = [
    // {
    //   // title: category ? <div>Tag <Select options={[{label:'1',value:'1'}]}/></div> : 'Tag',
    //   title: 'Tag',
    //   dataIndex: 'tag',
    // },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    type === 'GROUP_CHAT'
      ? {
          title: 'Avatar',
          dataIndex: 'avatar',
          render: (t) => <Image width={100} height={100} src={t} />,
        }
      : null,
  ].filter(Boolean);

  return (
    <ModalForm<{
      project: string;
      weight: string;
    }>
      title={category || ''}
      open={isOpen}
      width={800}
      onOpenChange={(v) => setOpen(v)}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
        afterClose: () => setCollectionId([]),
        styles: { body: { maxHeight: '70vh', overflowY: 'auto' } },
      }}
      submitTimeout={2000}
      onFinish={async () => {
        const selectedId = collectionId[0];
        if (!selectedId) {
          message.error('Please select a bot');
          return;
        }
        const selectedItem = list.find((ele) => ele.botId === selectedId);
        console.log(list, selectedId, selectedItem);
        // return

        return postBotManageSphereBot({
          ...selectedItem,
          botId: selectedId,
          type,
          collectionId: id,
        }).then((res) => {
          if (res?.code === 0) {
            setOpen(false);
            actionRef.current.reload();
            setExistingBotIds((list: any) => (list || []).concat(selectedId));
          } else {
            message.error(res?.msg || 'failed');
            return Promise.reject(res?.msg || 'failed');
          }
        });
      }}
    >
      <ProTable<any>
        rowKey="botId"
        search={false}
        toolBarRender={false}
        rowSelection={{
          type: 'radio',
          fixed: true,
          onChange: (selectedRowKeys) => {
            setCollectionId(selectedRowKeys as number[]);
          },
        }}
        loading={expertLoading || storyLoading || gameLoading || groupLoading}
        dataSource={list.filter((r) => !existingBotIds.includes(r.id))}
        tableAlertRender={false}
        columns={columnsmodel}
        pagination={false}
        // pagination={{
        //   showSizeChanger: true,
        //   defaultPageSize: 10,
        //   pageSizeOptions: [100, 50, 20, 10, 5],
        // }}
        dateFormatter="string"
      />
    </ModalForm>
  );
};

export default EditForm;
