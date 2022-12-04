import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewApi from "../../api/reviewApi";
import { action_status } from "../../utils/constants/status";
import { toast } from "react-toastify";
export const createFeedback = createAsyncThunk(
  "user/createFeedback",
  async (payload) => {
    try {
      const response = await reviewApi.postReview(payload);
      toast.dismiss();
      toast.success("Cảm ơn bạn đã đánh giá sản phẩm", { pauseOnHover: false });
      return response.data;
    } catch (error) {
      if (error.message.includes("duplicate")) {
        error.message = "Mỗi sản phẩm chỉ được đánh giá 1 lần";
      }
      toast.dismiss();
      toast.warning(error.message, { pauseOnHover: false });
    }
  }
);

export const getFeedback = createAsyncThunk(
  "user/getFeedback",
  async (payload) => {
    console.log(payload);
    const query = `page=${payload.page}&limit=3`;
    const response = await reviewApi.getReview(payload.id, query);
    return response.data;
  }
);

export const updateFeedback = createAsyncThunk(
  "user/updateFeedback",
  async (payload) => {
    const data = {
      rating: payload.rating,
      review: payload.review,
    };
    const response = await reviewApi.updateReview(data, payload.product);
    return response.data;
  }
);

export const deleteReview = createAsyncThunk(
  "user/deleteReview",
  async (payload) => {
    const response = await reviewApi.deleteReview(payload.id);
    return response.data;
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbackAdd: false,
    feedbackUpdate: false,
    feedbackDelete: false,
    feedback: {},
    totalPage: null,
  },
  reducers: {
    refresh: (state, action) => {
      state.feedbackAdd = false;
      state.feedbackUpdate = false;
      state.feedbackDelete = false;
    },
  },
  extraReducers: {
    [getFeedback.pending]: (state, action) => {
      state.status = action_status.LOADING;
    },
    [getFeedback.fulfilled]: (state, action) => {
      state.status = action_status.SUCCEEDED;
      state.feedback = action.payload;
      state.totalPage = action.payload.totalPage;
    },
    [getFeedback.rejected]: (state, action) => {
      state.status = action_status.FAILED;
    },
    [createFeedback.fulfilled]: (state, action) => {
      state.feedbackAdd = true;
    },
    [updateFeedback.fulfilled]: (state, action) => {
      state.feedbackUpdate = true;
    },
    [deleteReview.fulfilled]: (state, action) => {
      state.feedbackDelete = true;
    },
  },
});

const { actions, reducer } = feedbackSlice;
export const { refresh } = actions;
export default reducer;
