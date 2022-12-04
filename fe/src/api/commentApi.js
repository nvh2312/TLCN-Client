import axiosClient from "./axiosClient";

const commentApi = {
  postComment(data) {
    const url = "/api/v1/comments";
    return axiosClient.post(url, data);
  },
  getComment(id, query) {
    const url = `/api/v1/products/${id}/comments?${query}`;
    return axiosClient.get(url);
  },
  updateComment(data, id) {
    const url = `/api/v1/comments/${id}`;
    return axiosClient.patch(url, data);
  },
  deleteComment(id) {
    const url = `/api/v1/comments/${id}`;
    return axiosClient.delete(url);
  },
  likeComment(id) {
    const url = `/api/v1/comments/setLike/${id}`;
    return axiosClient.patch(url);
  },
};
export default commentApi;
