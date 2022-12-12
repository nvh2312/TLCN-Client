import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { action_status } from "../../utils/constants/status";
import commentApi from "../../api/commentApi";
export const createComment = createAsyncThunk(
  "user/createComment",
  async (payload) => {
    try {
      const response = await commentApi.postComment(payload);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

export const getComment = createAsyncThunk(
  "user/getComment",
  async (payload) => {
    const query = `page=${payload.page}&limit=3`;
    const response = await commentApi.getComment(payload.id, query);
    return response.data;
  }
);

export const updateComment = createAsyncThunk(
  "user/updateComment",
  async (payload) => {
    const data = {
      comment: payload.comment,
    };
    const response = await commentApi.updateComment(data, payload.id);
    return response.data;
  }
);

export const deleteComment = createAsyncThunk(
  "user/deleteComment",
  async (payload) => {
    const response = await commentApi.deleteComment(payload);
    return response.data;
  }
);

export const likeComment = createAsyncThunk(
  "user/likeComment",
  async (payload) => {
    const response = await commentApi.likeComment(payload);
    return response.data;
  }
);

const CommentSlice = createSlice({
  name: "comment",
  initialState: {
    commentAdd: false,
    commentUpdate: false,
    commentDelete: false,
    commentLike: false,
    comment: {},
    totalPage: null,
    status: action_status.IDLE,
  },
  reducers: {
    refresh: (state, action) => {
      state.commentAdd = false;
      state.commentUpdate = false;
      state.commentDelete = false;
      state.commentLike = false;
    },
  },
  extraReducers: {
    [getComment.pending]: (state, action) => {
      state.status = action_status.LOADING;
    },
    [getComment.fulfilled]: (state, action) => {
      state.status = action_status.SUCCEEDED;
      state.comment = action.payload;
      state.totalPage = action.payload.totalPage;
    },
    [getComment.rejected]: (state, action) => {
      state.status = action_status.FAILED;
    },
    [createComment.fulfilled]: (state, action) => {
      state.commentAdd = true;
    },
    [updateComment.fulfilled]: (state, action) => {
      state.commentUpdate = true;
    },
    [deleteComment.fulfilled]: (state, action) => {
      state.commentDelete = true;
    },
    [likeComment.fulfilled]: (state, action) => {
      state.commentLike = true;
    },
  },
});

const { actions, reducer } = CommentSlice;
export const { refresh } = actions;
export default reducer;
