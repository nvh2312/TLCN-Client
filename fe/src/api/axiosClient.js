import axios from "axios";
const axiosClient = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/JSON",
  },
  // withCredentials: true,
});
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const { config, status, data } = error.response;
    const URLs = [
      "/api/v1/users/signup",
      "/api/v1/users/login",
      "/api/v1/users/verify",
      "/api/v1/users/forgotPassword",
      "/api/v1/users/changeState",
      "/api/v1/users/logout",
      "/api/v1/users/verifyResetPass",
      "/api/v1/users/me",
      "/api/v1/api/v1/users/resetPassword/:token",
      "/api/v1/users/updateMe",
      "/api/v1/users/createAddress",
      "/api/v1/users/me/address",
      "/api/v1/users/deleteAddress",
      "/api/v1/users/updateAddress",
      "/api/v1/users/updateMyPassword",
      "/api/v1/users/setDefaultAddress",
      "/api/v1/products",
      "/api/v1/reviews",
      "/api/v1/products/:id/reviews",
      "/api/v1/reviews/:id",
      "/api/v1/orders",
      "/api/v1/users/userLoginWith",
      "/api/v1/comments",
      "/api/v1/products/:id/comments?query",
      "/api/v1/comments/:id",
      "/api/v1/comments/setLike/:id",
    ];
    if (
      (URLs.includes(config.url) && status === 500) ||
      status == 400 ||
      status == 401 ||
      status == 404 ||
      status == 403
    ) {
      throw new Error(data.message);
    }
    return Promise.reject(error);
  }
);
export default axiosClient;
