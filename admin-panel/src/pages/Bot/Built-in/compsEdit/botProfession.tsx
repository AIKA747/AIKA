import { getBotManageDic } from '@/services/api/botService';
import { useRequest } from 'ahooks';
import { Checkbox, Col, Input, Row, Select, Space } from 'antd';
import { useEffect, useState } from 'react';

export default ({
  value: profession,
  onChange,
}: {
  value?: string; // value的值，就是onChange函数返回的值,也是表单初始化profession字段的值
  onChange?: (value?: string) => void; // onChange函数，如果没有传入，也会自己默认
}) => {
  const [professionIsOther, setProfessionIsOther] = useState(false);

  const { data: botProfessionCollects } = useRequest(() =>
    getBotManageDic({ dicType: 'botProfession' }),
  );

  useEffect(() => {
    if (botProfessionCollects?.data && profession) {
      setProfessionIsOther(
        !botProfessionCollects.data.some((ele) => ele.dicValue === profession),
      );
    }
  }, [botProfessionCollects, profession]);

  return (
    <Space direction="vertical">
      <Row>
        <Col span={12}>
          <Select
            style={{ width: 500 }}
            disabled={professionIsOther}
            value={professionIsOther ? '' : profession}
            options={botProfessionCollects?.data.map((ele) => {
              return {
                value: ele.dicValue,
                label: ele.dicValue,
              };
            })}
            onChange={(v) => {
              onChange?.(v);
            }}
          />
        </Col>
      </Row>

      <Row
        style={{
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <Col span={8}>
          <Checkbox.Group
            onChange={(v) => {
              console.log(v);
              setProfessionIsOther(v[0] ? true : false);
              onChange?.('');
            }}
            value={[professionIsOther]}
            options={[{ label: 'Other Profession :', value: true }]}
          />
        </Col>
        <Col span={5}>
          {professionIsOther && (
            <Input
              style={{ width: 300 }}
              placeholder="please enter here"
              value={profession}
              onChange={(e) => {
                onChange?.(e.target.value);
              }}
            />
          )}
        </Col>
      </Row>
    </Space>
  );
};
