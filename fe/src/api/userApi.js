import { data } from "autoprefixer";
import axiosClient from "./axiosClient";

const userApi = {
  register(data) {
    const url = "/api/v1/users/signup";
    return axiosClient.post(url, data);
  },
  login(data) {
    const url = "/api/v1/users/login";
    return axiosClient.post(url, data);
  },
  loginWithGoogle(data) {
    const url = "/api/v1/users/userLoginWith";
    return axiosClient.post(url, data);
  },
  verify(data) {
    const url = "/api/v1/users/verify";
    return axiosClient.post(url, data);
  },
  forgotPassword(data) {
    const url = "/api/v1/users/forgotPassword";
    return axiosClient.post(url, data);
  },
  changeState(data) {
    const url = "/api/v1/users/changeState";
    return axiosClient.patch(url, data);
  },
  logout() {
    const url = "/api/v1/users/logout";
    return axiosClient.get(url);
  },
  verifyResetPassword(data) {
    const url = "/api/v1/users/verifyResetPass";
    return axiosClient.post(url, data);
  },
  getUser() {
    const url = "/api/v1/users/me";
    return axiosClient.get(url);
  },
  resetPassword(data, token) {
    const url = `/api/v1/users/resetPassword/${token}`;
    return axiosClient.patch(url, data);
  },
  updateUser(data) {
    const url = "/api/v1/users/updateMe";
    return axiosClient.patch(url, data);
  },
  addAddress(data) {
    const url = "/api/v1/users/createAddress";
    return axiosClient.patch(url, data);
  },
  getAddress() {
    const url = "/api/v1/users/me/address";
    return axiosClient.get(url);
  },
  deleteAddress(data) {
    const url = "/api/v1/users/deleteAddress";
    return axiosClient.patch(url, data);
  },
  updateAddress(data) {
    const url = "/api/v1/users/updateAddress";
    return axiosClient.patch(url, data);
  },
  updatePassword(data) {
    const url = "/api/v1/users/updateMyPassword";
    return axiosClient.patch(url, data);
  },
  updateDefault(data) {
    const url = "/api/v1/users/setDefaultAddress";
    return axiosClient.patch(url, data);
  },
  payment(data) {
    const url = "/api/v1/payments/create_payment_url";
    return axiosClient.post(url, data);
  },
  statusPayment(data) {
    const url = "/api/v1/payments/return_payment_status";
    return axiosClient.post(url, data);
  },
  statusPaypal(data) {
    const url = "/api/v1/payments/return_paypal_status";
    return axiosClient.post(url, data);
  },
  nearestLocation(data) {
    const url = `/api/v1/locations/get-nearest-location?latitude=${data.latitude}&longitude=${data.longitude}`;
    return axiosClient.get(url);
  },
};
export default userApi;
