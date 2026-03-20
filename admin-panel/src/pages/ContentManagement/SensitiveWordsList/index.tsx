import ActionsWrap from '@/components/ActionsWrap';
import LinkButton from '@/components/LinkButton';
import {
  deleteContentManageSensitiveWord,
  getContentManageSensitiveWords,
  postContentManageSensitiveWord,
  postContentManageSensitiveWords,
  putContentManageSensitiveWord,
} from '@/services/api/minganciguanli';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProCard,
  ProColumns,
  ProForm,
  ProFormText,
  ProFormUploadButton,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Form, message, Modal, Upload } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

// 敏感詞对象
interface WordVo {
  id: number;
  word: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export default () => {
  const actionRef = useRef<ActionType>();

  const [form] = Form.useForm<WordVo>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editVo, setEditVo] = useState<WordVo | undefined>(undefined);

  const [importForm] = Form.useForm();
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false);
  const [importFileContent, setImportFileContent] = useState<string[]>([]);

  const columns: ProColumns<WordVo>[] = [
    {
      title: 'Word',
      dataIndex: 'word',
      align: 'center',
    },
    {
      title: 'Created Time',
      dataIndex: 'createdAt',
      align: 'center',
      editable: false,
      hideInSearch: true,
      render: (_v, record) =>
        record?.createdAt
          ? dayjs(record?.createdAt).format('YYYY-MM-DD HH:mm:ss')
          : '-',
    },
    {
      title: 'Updated Time',
      dataIndex: 'updatedAt',
      align: 'center',
      editable: false,
      hideInSearch: true,
      render: (_v, record) =>
        record?.updatedAt
          ? dayjs(record?.updatedAt).format('YYYY-MM-DD HH:mm:ss')
          : '-',
    },
    {
      title: 'Action',
      align: 'left',
      dataIndex: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (_v, record) => (
        <ActionsWrap max={3}>
          <LinkButton
            onClick={() => {
              console.log('edit', record);
              setEditVo(record);
              form.setFieldsValue({
                word: record.word,
              });
              setModalVisible(true);
            }}
          >
            Edit
          </LinkButton>
          <LinkButton
            onClick={() => {
              if (record.id) {
                Modal.confirm({
                  title: `Are you sure delete this sensitive word?`,
                  okType: 'danger',
                  onOk: () => {
                    const hide = message.loading('loading...', 0);
                    deleteContentManageSensitiveWord({
                      id: Number(record.id),
                    }).then(() => {
                      hide();
                      message.success(
                        'Operation successful，About to refresh',
                        1.5,
                        () => {
                          actionRef.current?.reload();
                        },
                      );
                    });
                  },
                });
              }
            }}
          >
            Delete
          </LinkButton>
        </ActionsWrap>
      ),
    },
  ];

  // 解析 Excel 文件
  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryData = e.target.result;
      const workbook = XLSX.read(binaryData, { type: 'binary' });
      const sheetName = workbook.SheetNames[0]; // 获取第一个工作表
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // 转换为 JSON 数据

      // 处理表头
      // const headers = jsonData[0].map((header) => ({
      //   title: header,
      //   dataIndex: header,
      //   key: header,
      // }));
      // if ((headers || []).length !== 1) {
      //   message.error('The content format of the Excel file is incorrect!');
      // }

      // 处理数据行
      // const rows = jsonData.slice(1).map((row, index) => {
      //   const rowData = {};
      //   row.forEach((cell, cellIndex) => {
      //     rowData[headers[cellIndex].dataIndex] = cell;
      //   });
      //   console.log('rowData:', rowData, index);
      //   return { ...rowData, key: index };
      // });
      const rows = jsonData
        .slice(1)
        .map((row) => row[0])
        .filter(Boolean);
      if (rows.length < 1) {
        message.error('No data to upload.');
      }
      const uniqueRows = [...new Set(rows)]; // 去重
      setImportFileContent(uniqueRows);
      console.log('rows:', rows, uniqueRows);

      message.success('Excel file parsed successfully!');
    };
    reader.readAsBinaryString(file);
  };

  return (
    <PageContainer title={'Sensitive Words List'}>
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProTable<WordVo>
          headerTitle="Sensitive Words List"
          actionRef={actionRef}
          rowKey={'id'}
          // search={false}
          toolBarRender={() => [
            <Button
              key="1"
              type="primary"
              loading={submitLoading}
              onClick={() => {
                setModalVisible(true);
                form.setFieldsValue({
                  word: '',
                });
              }}
            >
              Add New
            </Button>,
            <ModalForm
              key="2"
              width={630}
              title="Upload Sensitive Words Excel"
              trigger={
                <Button
                  type="primary"
                  onClick={() => {
                    setImportModalVisible(true);
                  }}
                >
                  Batch Import
                </Button>
              }
              form={importForm}
              open={importModalVisible}
              onOpenChange={(open) => setImportModalVisible(open)}
              layout="horizontal"
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
              }}
              submitTimeout={2000}
              onFinish={async () => {
                if (importFileContent.length < 0) {
                  message.error(
                    'Please upload the correct sensitive terms Excel file first.',
                  );
                }
                // 如果导入的数据过多，则分批次调用接口保存
                let successCount = 0; // 记录成功的批次数量
                let failureReasons = []; // 记录失败的原因

                for (let i = 0; i < importFileContent.length; i += 100) {
                  const batchData = importFileContent.slice(i, i + 100);
                  try {
                    const res = await postContentManageSensitiveWords(
                      batchData,
                    );
                    if (res.code === 0) {
                      successCount++; // 成功批次计数
                    } else {
                      failureReasons.push(
                        `Batch ${i / 100 + 1} failed: ${res.msg}`,
                      ); // 记录失败原因
                    }
                  } catch (error) {
                    failureReasons.push(
                      `Batch ${i / 100 + 1} failed: ${error.message}`,
                    ); // 记录异常原因
                  }
                }

                // 处理最终结果
                if (
                  successCount === Math.ceil(importFileContent.length / 100)
                ) {
                  // 全部成功
                  message.success(
                    'All batches imported successfully. Refreshing data...',
                    1.5,
                    () => {
                      actionRef.current?.reload(); // 刷新数据
                      setImportModalVisible(false); // 关闭模态窗
                    },
                  );
                } else if (failureReasons.length > 0) {
                  // 部分失败
                  message.error(
                    `Some batches failed. Reasons: ${failureReasons.join(
                      '; ',
                    )}`,
                    5, // 显示 5 秒
                  );
                  setImportModalVisible(false); // 关闭模态窗
                }
              }}
            >
              <ProForm.Item
                labelCol={{ span: 8 }}
                label="Download template file"
              >
                <a
                  download="demo.xlsx"
                  href="/sensitive-words-demo.xlsx"
                  style={{ textDecoration: 'underline' }}
                >
                  demo.xlsx
                </a>
              </ProForm.Item>

              <ProFormUploadButton
                labelCol={{ span: 8 }}
                name="excel"
                label="Sensitive Words Excel"
                max={1}
                title={'Upload'}
                fieldProps={{
                  name: 'file',
                  // listType: 'picture-card',
                  accept: '.xls, .xlsx',
                  beforeUpload: (file) => {
                    // 验证文件类型
                    const isExcel =
                      file.type === 'application/vnd.ms-excel' ||
                      file.type ===
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    if (!isExcel) {
                      message.error('Only supports uploading Excel files!');
                      return Upload.LIST_IGNORE; // 阻止文件上传
                    }
                    parseExcel(file);
                    return false; // 阻止自动上传
                  },
                }}
                rules={[
                  { required: true, message: 'Please upload Excel files!' },
                ]}
              />
            </ModalForm>,
          ]}
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
            } = await getContentManageSensitiveWords({
              ...newParams,
            });

            return {
              data: list || [],
              success: true,
              total,
            };
          }}
          columns={columns}
          dateFormatter="string"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
        />
      </ProCard>

      <ModalForm
        key="1"
        width={630}
        title={editVo && editVo.id > 0 ? 'Edit' : 'Add'}
        form={form}
        open={modalVisible}
        onOpenChange={(open) => {
          setModalVisible(open);
          if (!open) {
            form.resetFields();
            setEditVo(undefined);
          }
        }}
        layout="horizontal"
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log('run'),
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          setSubmitLoading(true);
          if (editVo && editVo.id > 0) {
            // 修改
            await putContentManageSensitiveWord({
              ...values,
              id: editVo.id,
            })
              .then((res) => {
                if (res.code === 0) {
                  message.success(
                    'Operation successful，About to refresh',
                    1.5,
                    () => {
                      actionRef.current?.reload();
                    },
                  );
                } else {
                  message.error(res.msg);
                }
              })
              .finally(() => {
                setSubmitLoading(false);
                setModalVisible(false);
              });
          } else {
            // 新增
            await postContentManageSensitiveWord({
              ...values,
            })
              .then((res) => {
                if (res.code === 0) {
                  message.success(
                    'Operation successful，About to refresh',
                    1.5,
                    () => {
                      actionRef.current?.reload();
                    },
                  );
                } else {
                  message.error(res.msg);
                }
              })
              .finally(() => {
                setSubmitLoading(false);
                setModalVisible(false);
              });
          }
        }}
      >
        <ProFormText label="Sensitive Word" name="word" required />
      </ModalForm>
    </PageContainer>
  );
};
