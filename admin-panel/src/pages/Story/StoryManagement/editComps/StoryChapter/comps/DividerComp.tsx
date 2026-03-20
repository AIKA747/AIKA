import { Divider } from 'antd';

export default (props: any) => {
  const { subTitle, desc } = props;
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 20,
        }}
      >
        <h4>{subTitle}</h4>
        <h4>{desc}</h4>
      </div>
      <Divider style={{ background: '#444', marginTop: 0 }} />
    </>
  );
};
