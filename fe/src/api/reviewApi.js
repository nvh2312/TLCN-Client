import axiosClient from "./axiosClient";

const reviewApi = {
  postReview(data) {
    const url = "/api/v1/reviews";
    return axiosClient.post(url, data);
  },
  getReview(id, query) {
    const url = `/api/v1/products/${id}/reviews?${query}`;
    return axiosClient.get(url);
  },
  updateReview(data, id) {
    const url = `/api/v1/reviews/${id}`;
    return axiosClient.patch(url, data);
  },
  deleteReview(id) {
    const url = `/api/v1/reviews/${id}`;
    return axiosClient.delete(url);
  },
};
export default reviewApi;
