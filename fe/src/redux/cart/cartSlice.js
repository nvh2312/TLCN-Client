import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const cartSlice = createSlice({
  name: "cart",
  initialState: { cart: null },
  reducers: {
    getCart(state, action) {
      state.cart = JSON.parse(localStorage.getItem("cart"));
    },
    addToCart(state, action) {
      // newItems = {id,product,quantity}
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (!cart) {
        cart = [];
      }
      const newItem = action.payload;
      const index = cart.findIndex((x) => x.id === newItem.id);
      if (index >= 0) {
        if (cart[index].quantity < newItem.product.inventory) {
          cart[index].quantity += newItem.quantity;
          toast.dismiss();
          toast.success("Đã thêm sản phẩm vào giỏ hàng");
        } else {
          toast.dismiss();
          toast.warning("Chỉ còn 1 sản phẩm");
        }
      } else {
        toast.dismiss();
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
        cart.push(newItem);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      state.cart = cart;
    },
    setQuantity(state, action) {
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (!cart) {
        cart = [];
      }
      const { id, quantity } = action.payload;
      const index = cart.findIndex((x) => x.id === id);
      if (index >= 0) {
        cart[index].quantity = quantity;
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      state.cart = cart;
    },
    removeFromCart(state, action) {
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (!cart) {
        cart = [];
      }
      const idNeedToRemove = action.payload;
      cart = cart.filter((x) => x.id !== idNeedToRemove);
      localStorage.setItem("cart", JSON.stringify(cart));
      state.cart = cart;
    },
    resetCart(state) {
      state.cart = [];
      let cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
    },
  },
});

const { actions, reducer } = cartSlice;
export const { addToCart, setQuantity, removeFromCart, getCart, resetCart } =
  actions;
export default reducer; //default export
