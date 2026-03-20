// import { TOKEN } from '@/constants';
// import { FileSizeLimit } from '@/pages/Story/utils';
// import {
//   postBotManageShpere,
//   putBotManageShpere,
// } from '@/services/api/spherexin';
// import storage from '@/utils/storage';
// import {
//   ProCard,
//   ProForm,
//   ProFormInstance,
//   ProFormText,
//   ProFormUploadButton,
// } from '@ant-design/pro-components';
// import { useParams } from '@umijs/max';
// import { Button, message } from 'antd';
// import { useEffect, useRef, useState } from 'react';
// import Types from './Types';
//
// const SphereEdit = function () {
//   const { id } = useParams();
//
//   const formRef = useRef<ProFormInstance>();
//
//   const [category, setCategory] = useState();
//   const [avatar, setAvatar] = useState();
//
//   useEffect(() => {
//     if (id !== 'new') {
//       const record = storage.get('sphere-edit-info');
//       if (record) {
//         console.log(record);
//         const _record = { ...record, avatar: [{ url: record.avatar }] };
//         setAvatar(record.avatar);
//         setCategory(record.category);
//         formRef.current?.setFieldsValue(_record);
//       }
//     }
//   }, [id]);
//
//   return (
//     <ProCard title="APP-side Setting" style={{ paddingRight: 100 }}>
//       <ProForm
//         layout="horizontal"
//         formRef={formRef}
//         onFinish={async (values) => {
//           console.log(values);
//           const hide = message.info('on saving...');
//           const res =
//             id === 'new'
//               ? await postBotManageShpere({
//                   ...values,
//                   category,
//                 } as any)
//               : await putBotManageShpere({
//                   ...values,
//                   category,
//                   id,
//                 } as any);
//           if (res.code === 0) {
//             hide();
//             message.success('Success');
//             history.back();
//           } else {
//             message.error(res.msg);
//           }
//         }}
//         submitter={{
//           render: (props) => {
//             // console.log(props, doms);
//             return [
//               <div
//                 key="001"
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'center',
//                   margin: '20px 0',
//                 }}
//               >
//                 <Button
//                   type="primary"
//                   key="submit"
//                   htmlType="submit"
//                   style={{ marginRight: '10px' }}
//                   onClick={() => props.form?.submit?.()}
//                 >
//                   Save
//                 </Button>
//                 <Button
//                   type="default"
//                   key="rest"
//                   style={{ marginLeft: '10px' }}
//                   onClick={() => props.form?.resetFields()}
//                 >
//                   Cancel
//                 </Button>
//               </div>,
//             ];
//           },
//         }}
//         labelCol={{
//           span: 4,
//         }}
//       >
//         <ProFormText
//           width="md"
//           name="collectionName"
//           label="collectionName"
//           placeholder="please select"
//           rules={[{ required: true, message: 'please select' }]}
//         />
//
//         {/*<div style={{ display: 'none' }}>*/}
//         {/*  <ProFormUploadButton*/}
//         {/*    name="avatar"*/}
//         {/*    label="avatar"*/}
//         {/*    action={APP_API_HOST + '/user/public/file-upload'}*/}
//         {/*    max={1}*/}
//         {/*    title={'Upload'}*/}
//         {/*    fieldProps={{*/}
//         {/*      name: 'file',*/}
//         {/*      listType: 'picture-card',*/}
//         {/*      accept: 'image/*',*/}
//         {/*      headers: {*/}
//         {/*        Authorization: `${storage.get(TOKEN)}`,*/}
//         {/*      },*/}
//         {/*      beforeUpload: (file) => {*/}
//         {/*        return FileSizeLimit(file);*/}
//         {/*      },*/}
//         {/*      onPreview(file) {*/}
//         {/*        window.open(file.url);*/}
//         {/*      },*/}
//         {/*    }}*/}
//         {/*    rules={[{ required: true, message: 'Please upload image!' }]}*/}
//         {/*    transform={(val) => ({*/}
//         {/*      avatar: val[0]?.response?.data || avatar,*/}
//         {/*    })}*/}
//         {/*  />*/}
//         {/*</div>*/}
//
//         <ProForm.Item
//           name="type"
//           label="type"
//           labelCol={{
//             span: 4,
//           }}
//         >
//           <Types setCategory={setCategory} category={category} />
//         </ProForm.Item>
//       </ProForm>
//
//
//     </ProCard>
//   );
// };
//
// export default SphereEdit;
