import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { DropDownProps } from 'antd/lib/dropdown';
import LinkButton from '../LinkButton';

export default (props: DropDownProps & { moreText?: string }) => {
  const { moreText = '更多', ...rest } = props;
  return (
    <Dropdown
      trigger={['click']}
      overlayClassName="more-dropdown"
      placement="bottomRight"
      {...rest}
    >
      <LinkButton>
        {moreText} <DownOutlined />
      </LinkButton>
    </Dropdown>
  );
};
