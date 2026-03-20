import Tree from '@/components/Tree';
import clearTree from '@/components/Tree/clearTree';
import {
  getAdminResources,
  getAdminRoleId,
  postAdminRole,
  putAdminRole,
} from '@/services/api/quanxianguanli';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Form, message, Space } from 'antd';
import { useRef, useState } from 'react';

// sourcetree注意事项：1. path:"" 必传  2. 测试接口和生产接口都要更新  3. 更新子菜单注意父级菜单的id  4.

export default () => {
  const formRef = useRef<ProFormInstance>();
  const { id } = useParams<{ id: string }>();
  const [submintLoading, setSubmintLoading] = useState(false);
  const [resourceIds, setIds] = useState<any[]>([]);

  const [halfCheckedKeys, setHalfCheckedKeys] = useState<any[]>([]);
  // 用于缓存每次tree表单改动时，每次提交都转化为string随remark字段一起提交

  const [halfCheckedKeysInit, setHalfCheckedKeysInit] = useState<any[]>([]);
  //用于缓存初始化时子集有被选取但未全选的id，如果提交时tree表单是未有改动，则拼接到resourceIds中一起提交

  const [isChaged, setChangedFlag] = useState<boolean>(false); // tree表单是否有改动

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  // 获取菜单列表
  const { data: menuData } = useRequest(getAdminResources, {
    manual: false,
  });

  // 获取角色详情
  const { data: adminRolesDetail, loading } = useRequest(
    () => getAdminRoleId({ id: String(id) }),
    {
      manual: !id || id === 'new',
      onSuccess(res) {
        if (res.code === 0) {
          const resourceIds = res.data.resourceIds || [];
          const remark = res.data?.remark.split(',') || [];
          const resourceIdsDisaply = resourceIds.filter(
            (ele) => !remark.includes(ele),
          );
          // console.log(resourceIds, remark, resourceIdsDisaply);

          setIds(resourceIdsDisaply);
          setHalfCheckedKeysInit(remark);
        } else {
          message.error(res.msg);
        }
      },
      onError() {
        message.error('error');
      },
    },
  );

  return (
    <PageContainer
      title={id === 'new' ? 'Add' : 'Edit'}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <ProCard title={''} style={{ marginBlockEnd: 24 }} loading={loading}>
        <ProForm<{ roleName: string; resourceIds: string[] }>
          formRef={formRef}
          name="adminRoles_form"
          layout="horizontal"
          {...formItemLayout}
          submitter={false}
          initialValues={
            //注意，props的数据如果是请求来的不能直接作为initialValues，无法更新渲染
            !!id && id !== 'new'
              ? {
                  ...adminRolesDetail?.data,
                  resourceIds,
                }
              : undefined
          }
          onFinish={async (value) => {
            setSubmintLoading(true);
            if (!!id && id !== 'new') {
              putAdminRole({
                ...value,
                resourceIds: isChaged
                  ? resourceIds.filter((ele) => ele)
                  : [...resourceIds, ...halfCheckedKeysInit].filter(
                      (ele) => ele,
                    ),
                remark: halfCheckedKeys.join(','),
                id: String(id),
              })
                .then((res) => {
                  if (res.code === 0) {
                    message.success('Success', 1.5, () => {
                      history.back();
                    });
                  } else {
                    message.error(res.msg);
                  }
                })
                .finally(() => setSubmintLoading(false));
            } else {
              postAdminRole({
                ...value,
                resourceIds: isChaged
                  ? resourceIds
                  : [...resourceIds, ...halfCheckedKeysInit],
                remark: halfCheckedKeys.join(','),
              })
                .then((res) => {
                  if (res.code === 0) {
                    message.success('Success', 1.5, () => {
                      history.back();
                    });
                  } else {
                    message.error(res.msg);
                  }
                })
                .finally(() => setSubmintLoading(false));
            }
          }}
        >
          <ProFormText
            label="Role name"
            name="roleName"
            width={'lg'}
            placeholder={'Plese enter role name'}
            rules={[{ required: true, message: 'Plese enter role name!' }]}
          />
          <Form.Item
            name="resourceIds" // 会造成bug
            // name="wk"
            label="Assign Permissions"
            rules={[{ required: true, message: 'Plese select!' }]}
          >
            <Tree
              value={resourceIds}
              onChange={(checkedKeysValue, halfCheckedKeys) => {
                console.log(checkedKeysValue, halfCheckedKeys);
                setChangedFlag(true);
                setIds([...checkedKeysValue, ...halfCheckedKeys]); //只要变动，就拼接二者
                setHalfCheckedKeys(halfCheckedKeys); // halfCheckedKeys缓存用于提交remark字段
              }}
              tree={clearTree({
                tree: menuData?.data || [],
                valueField: 'id',
                labelField: 'name',
              })}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                disabled={submintLoading}
                loading={submintLoading}
              >
                Save
              </Button>
              <Button onClick={() => history.back()}>Cancel</Button>
            </Space>
          </Form.Item>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};
