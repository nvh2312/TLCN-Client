import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";
import { action_status } from "../../utils/constants/status";
import StorageKeys from "../../utils/constants/storage-keys";

export const register = createAsyncThunk("user/register", async (payload) => {
  const response = await userApi.register(payload);
  localStorage.setItem(StorageKeys.TOKEN, response.token);
  localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
  return response.data.user;
});

export const verify = createAsyncThunk("user/verify", async (payload) => {
  const response = await userApi.verify(payload);
  localStorage.setItem("tokenStream", response.tokenStream);
  localStorage.setItem(StorageKeys.TOKEN, response.token);
  localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
  return response.data.user;
});

export const changeState = createAsyncThunk(
  "user/changeState",
  async (payload) => {
    const response = await userApi.changeState(payload);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
    return response.data.user;
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (payload) => {
    console.log(payload);
    const response = await userApi.resetPassword(payload, payload.token);
    localStorage.setItem("tokenStream", response.tokenStream);
    localStorage.setItem(StorageKeys.TOKEN, response.token);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
    return response.data.user;
  }
);

export const forgotPassword = createAsyncThunk(
  "user/fotgotPassword",
  async (payload) => {
    const response = await userApi.forgotPassword(payload);
    return response.data.user;
  }
);

export const verifyResetPassword = createAsyncThunk(
  "user/verifyResetPassword",
  async (payload) => {
    const response = await userApi.verifyResetPassword(payload);
    return response;
  }
);

export const login = createAsyncThunk("user/login", async (payload) => {
  const response = await userApi.login(payload);
  localStorage.setItem("tokenStream", response.tokenStream);
  localStorage.setItem(StorageKeys.TOKEN, response.token);
  localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
  return response.data.user;
});

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (payload) => {
    const response = await userApi.loginWithGoogle(payload);
    localStorage.setItem("tokenStream", response.tokenStream);
    localStorage.setItem(StorageKeys.TOKEN, response.token);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
    return response.data.user;
  }
);

export const updateInfoUser = createAsyncThunk(
  "user/updateInfoUser",
  async (payload) => {
    const response = await userApi.updateUser(payload);
    localStorage.setItem(StorageKeys.TOKEN, response.token);
    localStorage.setItem(StorageKeys.USER, JSON.stringify(response.data.user));
    return response.data.user;
  }
);

export const getUser = createAsyncThunk("user/getUser", async () => {
  const response = await userApi.getUser();
  return response.data.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    current: JSON.parse(localStorage.getItem(StorageKeys.USER)) || null,
    status: action_status.IDLE,
    user: {},
    update: false,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem(StorageKeys.TOKEN);
      localStorage.removeItem(StorageKeys.USER);
      localStorage.removeItem("order");
      localStorage.removeItem("keyword");
      localStorage.removeItem("tokenStream");
      state.current = null;
    },
    refresh: (state, action) => {
      state.update = false;
    },
  },
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [login.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [loginWithGoogle.fulfilled]: (state, action) => {
      state.current = action.payload;
      state.user = action.payload;
    },
    [verify.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [changeState.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.current = action.payload;
    },
    [getUser.pending]: (state, action) => {
      state.status = action_status.LOADING;
    },
    [getUser.fulfilled]: (state, action) => {
      state.status = action_status.SUCCEEDED;
      state.user = action.payload;
      state.current = action.payload;
    },
    [getUser.rejected]: (state, action) => {
      state.status = action_status.FAILED;
    },
    [updateInfoUser.fulfilled]: (state, action) => {
      state.update = true;
    },
  },
});

const { actions, reducer } = userSlice;
export const { logout, refresh } = actions;
export default reducer;
