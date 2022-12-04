import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderApi from "../../api/orderApi";
import { action_status } from "../../utils/constants/status";

const initialState = {
  status: action_status.IDLE,
  statusId: action_status.IDLE,
  totalPage: null,
  order: {},
  orderId: {},
  update: false,
};

export const getOrderId = createAsyncThunk(
  "user/getOrderId",
  async (payload) => {
    const response = await orderApi.getOrderId(payload);
    return response.data;
  }
);

export const cancelOrder = createAsyncThunk(
  "user/cancelOrder",
  async (payload) => {
    const response = await orderApi.cancelOrder(payload.id, payload.data);
    return response.data;
  }
);

export const getOrder = createAsyncThunk("user/getOrder", async (payload) => {
  let query = `page=${payload.page}&limit=${payload.limit}&status=${payload.status}`;
  if (payload.status === "All" || payload.status === undefined) {
    query = `page=${payload.page}&limit=${payload.limit}`;
  }
  const response = await orderApi.getOrder(payload.id, query);
  return response.data;
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    refresh: (state, action) => {
      state.update = false;
    },
  },
  extraReducers: {
    [getOrder.pending]: (state, action) => {
      state.status = action_status.LOADING;
    },
    [getOrder.fulfilled]: (state, action) => {
      state.status = action_status.SUCCEEDED;
      state.order = action.payload.data;
      state.totalPage = action.payload.totalPage;
    },
    [getOrder.rejected]: (state, action) => {
      state.status = action_status.FAILED;
    },
    [getOrderId.pending]: (state, action) => {
      state.statusId = action_status.LOADING;
    },
    [getOrderId.fulfilled]: (state, action) => {
      state.statusId = action_status.SUCCEEDED;
      state.orderId = action.payload.data;
    },
    [getOrderId.rejected]: (state, action) => {
      state.statusId = action_status.FAILED;
    },
    [cancelOrder.fulfilled]: (state, action) => {
      state.update = true;
    },
  },
});
const { actions, reducer } = orderSlice;
export const { refresh } = actions;
export default reducer;
