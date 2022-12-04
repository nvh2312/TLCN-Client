import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";
import { action_status } from "../../utils/constants/status";

export const addAddress = createAsyncThunk(
  "user/addAdress",
  async (payload) => {
    const response = await userApi.addAddress(payload);
  }
);

export const editAddress = createAsyncThunk(
  "user/editAddress",
  async (payload) => {
    const response = await userApi.updateAddress(payload);
  }
);

export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async (payload) => {
    const response = await userApi.deleteAddress(payload);
  }
);

export const setAddressDefault = createAsyncThunk(
  "user/setAddressDefault",
  async (payload) => {
    const response = await userApi.updateDefault(payload);
  }
);

export const getAddress = createAsyncThunk("user/getAddress", async () => {
  const response = await userApi.getAddress();
  return response.data.address;
});

const userSlice = createSlice({
  name: "address",
  initialState: {
    status: action_status.IDLE,
    address: [],
    updateAddress: false,
    add: false,
    deleteAddress: false,
  },
  reducers: {
    refresh: (state, action) => {
      state.updateAddress = false;
      state.add = false;
      state.deleteAddress = false;
    },
  },
  extraReducers: {
    [addAddress.fulfilled]: (state, action) => {
      state.add = true;
    },
    [editAddress.fulfilled]: (state, action) => {
      state.updateAddress = true;
    },
    [setAddressDefault.fulfilled]: (state, action) => {
      state.updateAddress = true;
    },
    [deleteAddress.fulfilled]: (state, action) => {
      state.deleteAddress = true;
    },
    [getAddress.pending]: (state, action) => {
      state.status = action_status.LOADING;
    },
    [getAddress.fulfilled]: (state, action) => {
      state.status = action_status.SUCCEEDED;
      state.address = action.payload;
    },
    [getAddress.rejected]: (state, action) => {
      state.status = action_status.FAILED;
    },
  },
});

const { actions, reducer } = userSlice;
export const { refresh } = actions;
export default reducer;
