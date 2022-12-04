import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/auth/userSlice";
import cartReducer from "../redux/cart/cartSlice";
import feedbackReducer from "../redux/feedback/feedbackSlice";
import productReducer from "./product/productSlice";
import addressReducer from "../redux/auth/addressSlice";
import orderReducer from "../redux/order/orderSlice";
import commentReducer from "../redux/feedback/commentSlice";

const rootReducer = {
  user: userReducer,
  address: addressReducer,
  cart: cartReducer,
  feedback: feedbackReducer,
  product: productReducer,
  order: orderReducer,
  comment: commentReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
