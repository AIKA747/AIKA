import {
  postContentManageCategory,
  putContentManageCategory,
} from '@/services/api/gushifenleiguanlixin';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const EditForm = ({ id, isOpen, setOpen, form, actionRef }: any) => {
  // const [submintLoading, setSubmintLoading] = useState(false);

  return (
    <ModalForm<{
      project: string;
      weight: string;
    }>
      title={id === 'new' ? 'Add' : 'Edit'}
      form={form}
      // formRef={formRef}
      open={isOpen}
      onOpenChange={(v) => setOpen(v)}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        await waitTime(500);
        if (!!id && id !== 'new') {
          putContentManageCategory({ ...values, id })
            .then((res) => {
              if (res.code === 0) {
                message.success('Success', 1.5, () => {
                  setOpen(false);
                });
              } else {
                message.error(res.msg);
              }
            })
            .finally(() => actionRef.current.reload());
        } else {
          postContentManageCategory({ ...values })
            .then((res) => {
              if (res.code === 0) {
                message.success('Success', 1.5, () => {
                  setOpen(false);
                });
              } else {
                message.error(res.msg);
              }
            })
            .finally(() => actionRef.current.reload());
        }

        return true;
      }}
    >
      <ProFormText name="name" label="Name" required />
      <ProFormText name="weight" label="Weight" />
    </ModalForm>
  );
};

export default EditForm;
