import { Image } from 'antd';
import { createRoot } from 'react-dom/client';

const previewImage = ({ url }: { url: string }) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <Image
      preview={{
        visible: true,
        src: url,
        onVisibleChange: (visible) => {
          if (!visible) {
            root.unmount();
            document.body.removeChild(container);
          }
        },
      }}
      src={url}
      style={{ display: 'none' }}
    />,
  );
};

export default previewImage;
