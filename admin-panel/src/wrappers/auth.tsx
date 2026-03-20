import { LOGIN_PATH } from '@/utils/constants';
import { Navigate, Outlet, useModel } from '@umijs/max';

export default () => {
  const { initialState } = useModel('@@initialState');
  console.log('initialState', initialState);
  const { isLogin } = { isLogin: !!initialState?.me?.name }; //useAuth();
  if (isLogin) {
    return <Outlet />;
  } else {
    if (window.location.href.includes('redirectTo')) {
      console.log('================');
    }
    return (
      <Navigate
        to={`${LOGIN_PATH}?${new URLSearchParams({
          redirectTo: window.location.href,
        })}`}
      />
    );
  }
};
