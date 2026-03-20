// 定义尺寸配置类型
type SizePreset = 'small' | 'middle' | 'large' | '1024';
type CustomSize = [number, number];
export type SizeOption = SizePreset | number | CustomSize;

// 定义支持的图片扩展名
const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

// 尺寸预设配置
const IMAGE_SIZE_PRESETS: Record<SizePreset, [number, number]> = {
  small: [160, 160],
  middle: [480, 480],
  large: [600, 600],
  '1024': [1024, 1024],
};

// 主函数
export default (url: string, sizeOption?: SizeOption): string => {
  // 如果输入不是字符串或为空，直接返回
  if (typeof url !== 'string' || !url.trim()) {
    return url;
  }
  if (!url.startsWith('http')) {
    return url;
  }

  try {
    // 创建URL对象
    const parsedUrl = new URL(url);

    // 检查是否是图片文件
    if (!isImageFile(parsedUrl.pathname)) {
      return url;
    }

    // 设置新的CDN主机
    parsedUrl.hostname = 'd3la0n0y456baq.cloudfront.net';

    // 设置自动格式参数
    parsedUrl.searchParams.set('format', 'auto');
    parsedUrl.searchParams.set('quality', '90');

    // 处理尺寸参数
    applySizeParameters(parsedUrl, sizeOption);

    // console.log('Original url:', url);
    // console.log('transform url:', parsedUrl.toString());
    return parsedUrl.toString();
  } catch (error) {
    // URL解析失败时返回原始URL
    console.error('URL解析失败:', error);
    return url;
  }
};

// 辅助函数：检查是否是图片文件
function isImageFile(pathname: string): boolean {
  const lastSegment = pathname.split('/').pop() || '';
  const extension = lastSegment.split('.').pop()?.toLowerCase() || '';

  return SUPPORTED_EXTENSIONS.includes(extension);
}

// 辅助函数：应用尺寸参数
function applySizeParameters(url: URL, sizeOption?: SizeOption): void {
  if (!sizeOption) return;

  let width: number | null = null;
  let height: number | null | 'auto' = null;

  // 处理预设尺寸
  if (typeof sizeOption === 'string') {
    const preset = sizeOption.toLowerCase() as SizePreset;
    if (IMAGE_SIZE_PRESETS[preset]) {
      [width, height] = IMAGE_SIZE_PRESETS[preset];
    }
  }
  // 处理数字尺寸
  else if (typeof sizeOption === 'number' && sizeOption > 0) {
    width = sizeOption;
    height = 'auto';
  }
  // 处理自定义尺寸
  else if (Array.isArray(sizeOption)) {
    if (
      sizeOption.length === 2 &&
      typeof sizeOption[0] === 'number' &&
      typeof sizeOption[1] === 'number' &&
      sizeOption[0] > 0 &&
      sizeOption[1] > 0
    ) {
      [width, height] = sizeOption;
    }
  }

  // 设置查询参数
  if (width !== null && height !== null) {
    url.searchParams.set('width', width.toString());
    url.searchParams.set('height', height.toString());
  }
}
