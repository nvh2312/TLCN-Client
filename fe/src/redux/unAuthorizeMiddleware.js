import { logout } from "./auth/userSlice";

const unAuthorizeMiddleware = (store) => (next) => (action) => {
  if (
    action.error &&
    action.error?.message?.includes("Tài khoản gần đây đã thay đổi mật khẩu!")
  ) {
    store.dispatch(logout());
    if (action.error.message === "Tài khoản gần đây đã thay đổi mật khẩu!")
      window.location.reload();
  }

  return next(action);
};

export default unAuthorizeMiddleware;
