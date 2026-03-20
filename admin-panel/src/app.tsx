import { RightAvatar } from '@/components/Layouts';
import { toLogin } from '@/utils';
import { LOGIN_PATH, TOKEN } from '@/utils/constants';
import storage from '@/utils/storage';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { requestConfig } from './requestConfig';
import {
  getAdminCurrentResources,
  getAdminMe,
} from './services/api/adminService';

// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  me?: Partial<any & { name?: string; avatar?: string }>;
  loading?: boolean;
  fetchMe?: () => Promise<
    Partial<any & { name?: string; avatar?: string }> | undefined
  >;
  digitHumanData?: any;
}> {
  let pageUrl = window.location.href;
  let url = '/' + pageUrl.split('/').slice(3).join('/');
  if (url.startsWith('/register')) {
    // 邮箱验证注册
    return {};
  }

  const fetchMe = async () => {
    try {
      const { data } = await getAdminMe();
      console.log({ data });

      return {
        ...data,
      };
    } catch (e) {}
    return undefined;
  };

  if (!storage.get(TOKEN)) {
    // 未登录的情况
    toLogin();
    return {
      fetchMe,
    };
  }

  // 如果不是登录页面，执行
  if (window.location.pathname !== LOGIN_PATH) {
    const currentUser = await fetchMe();
    return {
      fetchMe,
      me: {
        ...currentUser,
      },
    };
  }

  return {
    fetchMe,
    me: {},
  };
}

console.log('UMI_ENV:', UMI_ENV);

// 得到按钮权限
const processData = (data: any[]): Record<string, any[]> => {
  const result: Record<string, any[]> = {};

  const traverse = (
    node: any | null,
    parentName: string,
    result: Record<string, any[]>,
  ): void => {
    if (!node) return;

    // 如果节点类型为 'BUTTON'，将其加入结果
    if (node.type === 'BUTTON') {
      const key = parentName || ''; // 确保键不会为 null 或 undefined
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(node);
    }

    // 安全地递归遍历子节点
    if (Array.isArray(node.childrens) && node.childrens.length > 0) {
      try {
        node.childrens.forEach((child: any) =>
          traverse(child, node.name || '', result),
        );
      } catch (error) {
        console.error('Error during traversal:', error);
      }
    }
  };

  data.forEach((node) => traverse(node, node.name || '', result));
  return result;
};

export const layout: RunTimeLayoutConfig = ({ initialState }: any) => {
  return {
    fixSiderbar: true,
    splitMenus: false,
    layout: 'mix',
    // logo: require('@/assets/images/logo.svg').default,
    logo: <img src={require('@/assets/images/logo.svg').default} alt="" />,
    menu: {
      type: 'sub',
      collapsedShowGroupTitle: false,
      locale: false,
      request: async (params, defaultMenuData) => {
        // return Promise.resolve([...defaultMenuData]);

        const { data: menuAuth } = await getAdminCurrentResources({});
        // console.log({ defaultMenuData }, { menuAuth });
        // 保存按钮权限
        const buttonRole = processData(menuAuth);
        localStorage.setItem('buttonRole', JSON.stringify(buttonRole));

        // 只支持三级菜单
        let arr1: string[] = [],
          arr2: string[] = [],
          arr3: string[] = [];
        menuAuth.forEach((ele1) => {
          if (ele1.route) {
            arr1.push(ele1.route);
          }
          if (Array.isArray(ele1.childrens) && ele1.childrens.length > 0) {
            ele1.childrens.forEach((ele2) => {
              if (ele2.route) {
                arr2.push(ele2.route);
              }
              if (Array.isArray(ele2.childrens) && ele2.childrens.length > 0) {
                ele2.childrens.forEach((ele3) => {
                  if (ele3.route) {
                    arr3.push(ele3.route);
                  }
                });
              }
            });
          }
        });
        // console.log(arr1, arr2, arr3);

        let menusAfterCompared: any = [];
        // unaccessible 如何利用好？
        try {
          menusAfterCompared = defaultMenuData.map((ele1, index) => {
            if (index === 0) {
              // path: '/'
              return ele1;
            }
            if (!arr1.some((item) => ele1.path?.includes(item))) {
              ele1.unaccessible = true;
            }
            ele1.children = ele1?.children?.map((ele2) => {
              if (!arr2.some((item) => ele2.path?.includes(item))) {
                ele2.unaccessible = true;
              }
              ele2.children = ele2?.children?.map((ele3) => {
                if (!arr3.some((item) => ele3.path?.includes(item))) {
                  ele3.unaccessible = true;
                }
                return ele3;
              });
              return ele2;
            });
            // ele1.children = []
            ele1.routes = [];
            return ele1;
          });
        } catch (error) {
          console.log(error);
        }

        // console.log({ defaultMenuData });
        // console.log({ menusAfterCompared });

        return Promise.resolve([...menusAfterCompared]);
        //如果不设置unaccessible，即便菜单栏不展示，手动输入地址栏还是可以展示
      },
    },
    siderMenuType: 'sub',
    // siderMenuType: "group",
    bgLayoutImgList: [
      {
        src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    avatarProps: {
      src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
      size: 'small',
      title: initialState?.me?.username ?? '--',
      render: (props, dom) => {
        return <RightAvatar {...props}>{dom}</RightAvatar>;
      },
    },
    token: {
      sider: {
        colorBgMenuItemSelected: 'rgba(var(--color-primary-rgb), 0.15)',
        colorTextMenuSelected: 'var(--color-primary)',
      },
    },
    // onMenuHeaderClick: (e) => console.log(e),
    onMenuHeaderClick: (e) => {
      console.log(e);
      window.open(window.location.href);
    },
    menuFooterRender: (props) => {
      if (props?.collapsed) return undefined;
      return (
        <div
          style={{
            textAlign: 'left',
            paddingBlockStart: 12,
          }}
        >
          <div>2025.03.17.a</div>
        </div>
      );
    },
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = { ...requestConfig };
