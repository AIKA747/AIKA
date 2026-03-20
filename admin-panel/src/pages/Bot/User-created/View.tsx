import { getBotManageBotId } from '@/services/api/jiqirenguanli';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Space, Statistic } from 'antd';
import AddOn from './comps/Add-on';
import AnswerStratogy from './comps/AnswerStratogy';
import BasicInformations from './comps/BasicInformations';
import BotPrompt from './comps/BotPrompt';

export default () => {
  const { id } = useParams();
  const { data } = useRequest(() => getBotManageBotId({ id }));
  return (
    <PageContainer
      header={{
        title: 'View',
      }}
      extra={
        <Space size={140}>
          <ProCard.Group ghost direction={'row'}>
            <ProCard style={{ background: 'transparent' }}>
              <Statistic
                style={{ background: 'transparent' }}
                title="Rating"
                value={data?.data.rating}
                precision={2}
              />
            </ProCard>

            <ProCard style={{ background: 'transparent' }}>
              <Statistic
                title="Subscribers"
                value={data?.data.subscriberTotal}
                precision={0}
              />
            </ProCard>

            <ProCard style={{ background: 'transparent' }}>
              <Statistic
                title="Chat account"
                value={data?.data.chatTotal}
                // suffix="/ 100"
              />
            </ProCard>

            <ProCard style={{ background: 'transparent' }}>
              <Statistic title="Dialogues" value={data?.data.dialogues} />
            </ProCard>
          </ProCard.Group>

          <Button onClick={() => history.back()}>Back</Button>
        </Space>
      }
    >
      <ProCard>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '45%', borderRight: '1px solid #999' }}>
            <BasicInformations data={data?.data} />
            <BotPrompt data={data?.data} />
            <AnswerStratogy data={data?.data} />
          </div>

          <div style={{ width: '45%' }}>
            <AddOn data={data?.data} />
          </div>
        </div>
      </ProCard>
    </PageContainer>
  );
};
