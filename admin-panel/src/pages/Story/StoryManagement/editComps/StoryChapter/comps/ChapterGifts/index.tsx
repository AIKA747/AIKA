import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import CreateOrEditChapterGift from '@/pages/Story/StoryManagement/editComps/StoryChapter/comps/ChapterGifts/CreateOrEditChapterGift';
import { ProTable } from '@ant-design/pro-components';
import { Image } from 'antd';
import { useRef } from 'react';

export default (props: any) => {
  const { data, toReloadChapters } = props;
  const ref = useRef();

  const columns = [
    {
      title: 'Gift name',
      dataIndex: 'giftName',
      editable: false,
      align: 'center',
      width: 100,
    },
    {
      title: 'Gift image',
      dataIndex: 'image',
      editable: false,
      align: 'center',
      width: 100,
      render: (image: any) => {
        return <Image width={100} height={50} src={image} />;
      },
    },
    {
      title: 'Friend degree value',
      dataIndex: 'friendDegree',
      align: 'center',
      width: 100,
    },
    {
      title: 'Story degree',
      dataIndex: 'storyDegree',
      align: 'center',
      width: 100,
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: 'option',
      fixed: 'right',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <ActionsWrap max={3}>
          <CreateOrEditChapterGift
            title={' '}
            trigger={<LinkButton>Edit</LinkButton>}
            // storyId={id}
            giftId={record.id}
            // chapterId={chapterId}
            callback={toReloadChapters}
          />
          <LinkButton onClick={() => {}}>Delete</LinkButton>
        </ActionsWrap>
      ),
    },
  ];

  return (
    <ProTable
      rowKey="id"
      actionRef={ref}
      dataSource={data}
      search={false}
      toolBarRender={false}
      columns={columns}
    />
  );
};
